const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const multer = require('multer');

const db = require('./db');
const { authenticateJWT, JWT_SECRET } = require('./middleware/auth');

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS & JSON parsing
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// =========================================================================
// STRICT FILE UPLOAD SECURITY ENGINE (Anti-Malware & Executable Prevention)
// =========================================================================

const uploadsDir = path.resolve(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Allowed extensions whitelist
const ALLOWED_EXTENSIONS = ['.pdf', '.doc', '.docx'];

// Executable / Script extensions blacklist
const DANGEROUS_EXTENSIONS = [
  '.exe', '.bat', '.cmd', '.sh', '.php', '.phar', '.js', '.py', '.pl', '.cgi',
  '.asp', '.aspx', '.jsp', '.phtml', '.html', '.htm', '.svg', '.vbs', '.jar',
  '.scr', '.msi', '.dll', '.so', '.elf', '.bin', '.app', '.com', '.wsf', '.cpl'
];

// Allowed MIME types
const ALLOWED_MIME_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
];

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    // Generate safe random filename to eliminate path traversal & shell injection
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, `cv-${uniqueSuffix}${ext}`);
  }
});

// Multer Filter: Check Extension & Double Extensions
const fileFilter = (req, file, cb) => {
  const originalNameLower = file.originalname.toLowerCase();
  const ext = path.extname(originalNameLower);

  // 1. Extension Whitelist Check
  if (!ALLOWED_EXTENSIONS.includes(ext)) {
    return cb(new Error(`Security Error: Uploading ${ext} files is forbidden. Only PDF, DOC, and DOCX documents are accepted.`), false);
  }

  // 2. Double Extension & Shell Bypass Check (e.g. payload.php.pdf)
  const hasBlacklistedExt = DANGEROUS_EXTENSIONS.some((dangerExt) => originalNameLower.includes(dangerExt));
  if (hasBlacklistedExt) {
    return cb(new Error('Security Error: Double extension or executable script detected in filename.'), false);
  }

  // 3. MIME Type Check
  if (!ALLOWED_MIME_TYPES.includes(file.mimetype)) {
    return cb(new Error(`Security Error: Invalid MIME type ${file.mimetype}. Expected a valid document.`), false);
  }

  cb(null, true);
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB Limit
  }
});

// Magic Byte Verification Function
function verifyFileMagicBytes(filePath) {
  return new Promise((resolve) => {
    fs.open(filePath, 'r', (err, fd) => {
      if (err) return resolve(false);

      const buffer = Buffer.alloc(8);
      fs.read(fd, buffer, 0, 8, 0, (readErr) => {
        fs.close(fd, () => {});
        if (readErr) return resolve(false);

        // Check PDF signature (%PDF- -> 0x25 0x50 0x44 0x46)
        const isPdf = buffer[0] === 0x25 && buffer[1] === 0x50 && buffer[2] === 0x44 && buffer[3] === 0x46;

        // Check DOCX / ZIP signature (PK\x03\x04 -> 0x50 0x4B 0x03 0x04)
        const isDocx = buffer[0] === 0x50 && buffer[1] === 0x4B && buffer[2] === 0x03 && buffer[3] === 0x04;

        // Check DOC signature (0xD0 0xCF 0x11 0xE0)
        const isDoc = buffer[0] === 0xD0 && buffer[1] === 0xCF && buffer[2] === 0x11 && buffer[3] === 0xE0;

        resolve(isPdf || isDocx || isDoc);
      });
    });
  });
}

// Serve uploaded files securely with download enforcement headers
app.use('/uploads', (req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('Content-Security-Policy', "default-src 'none'");
  res.setHeader('Content-Disposition', 'attachment');
  next();
}, express.static(uploadsDir));

// =========================================================================
// AUTHENTICATION ENDPOINTS
// =========================================================================

// POST /api/auth/login - Admin Login
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required.' });
  }

  db.get(`SELECT * FROM users WHERE email = ?`, [email.toLowerCase().trim()], (err, user) => {
    if (err || !user) {
      return res.status(401).json({ error: 'Invalid credentials. User not found.' });
    }

    const isValid = bcrypt.compareSync(password, user.password_hash);
    if (!isValid) {
      return res.status(401).json({ error: 'Invalid password. Access denied.' });
    }

    const token = jwt.sign(
      { id: user.id, username: user.username, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    return res.json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role
      }
    });
  });
});

// GET /api/auth/me - Check current token session
app.get('/api/auth/me', authenticateJWT, (req, res) => {
  res.json({ user: req.user });
});

// POST /api/auth/change-password - Change HR Admin password
app.post('/api/auth/change-password', authenticateJWT, (req, res) => {
  const { current_password, new_password } = req.body;
  if (!current_password || !new_password) {
    return res.status(400).json({ error: 'Both current password and new password are required.' });
  }

  if (new_password.length < 6) {
    return res.status(400).json({ error: 'New password must be at least 6 characters long.' });
  }

  db.get(`SELECT * FROM users WHERE id = ?`, [req.user.id], (err, user) => {
    if (err || !user) {
      return res.status(404).json({ error: 'User account not found.' });
    }

    const isValid = bcrypt.compareSync(current_password, user.password_hash);
    if (!isValid) {
      return res.status(401).json({ error: 'Current password is incorrect.' });
    }

    const salt = bcrypt.genSaltSync(10);
    const newHash = bcrypt.hashSync(new_password, salt);

    db.run(`UPDATE users SET password_hash = ? WHERE id = ?`, [newHash, req.user.id], function (err) {
      if (err) {
        return res.status(500).json({ error: 'Failed to update password.' });
      }
      return res.json({ message: 'Password updated successfully. Please use your new password for future logins.' });
    });
  });
});

// =========================================================================
// APPLICATION ENDPOINTS
// =========================================================================

// POST /api/upload - Secure single document file upload endpoint
app.post('/api/upload', (req, res) => {
  upload.single('resume')(req, res, async (err) => {
    if (err instanceof multer.MulterError) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({ error: 'Security Error: File size exceeds the maximum limit of 5MB.' });
      }
      return res.status(400).json({ error: `Upload Error: ${err.message}` });
    } else if (err) {
      return res.status(400).json({ error: err.message });
    }

    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded.' });
    }

    // Secondary Security Check: Verify Magic Bytes / File Header Signature
    const isHeaderValid = await verifyFileMagicBytes(req.file.path);
    if (!isHeaderValid) {
      // Immediately purge spoofed or malicious file from disk
      fs.unlink(req.file.path, () => {});
      return res.status(400).json({
        error: 'Security Alert: File signature / magic bytes verification failed. The uploaded file does not match a genuine PDF, DOC, or DOCX document.'
      });
    }

    return res.json({
      message: 'File uploaded and verified securely!',
      filename: req.file.filename,
      originalName: req.file.originalname,
      path: `/uploads/${req.file.filename}`
    });
  });
});

// POST /api/applications/sales - Public Sales Application Submission
app.post('/api/applications/sales', (req, res) => {
  const {
    full_name, email, phone, city, linkedin_url,
    compensation_choice, commission_rate, base_salary,
    projected_monthly_sales, estimated_monthly_payout,
    sales_experience_years, sales_methodology, highest_single_deal, avg_sales_cycle,
    primary_sales_channel, key_achievements, product_expertise,
    banking_pitch_response, objection_handling_response, lead_generation_strategy, confidence_rating,
    resume_filename, notice_period, expected_start_date, cover_note
  } = req.body;

  if (!full_name || !email || !phone) {
    return res.status(400).json({ error: 'Full name, email, and phone number are required.' });
  }

  // AI Knowledge & Competency Score calculation heuristic
  let aiScore = 75;
  if (compensation_choice === '100_commission') aiScore += 8;
  if (sales_experience_years && sales_experience_years.includes('Senior')) aiScore += 6;
  if (banking_pitch_response && banking_pitch_response.length > 50) aiScore += 5;
  if (objection_handling_response && objection_handling_response.length > 40) aiScore += 4;
  if (confidence_rating && confidence_rating >= 4) aiScore += 2;
  if (aiScore > 98) aiScore = 98;

  const stmt = db.prepare(`
    INSERT INTO applications (
      role_type, full_name, email, phone, city, linkedin_url,
      compensation_choice, commission_rate, base_salary, projected_monthly_sales, estimated_monthly_payout,
      sales_experience_years, sales_methodology, highest_single_deal, avg_sales_cycle,
      primary_sales_channel, key_achievements, product_expertise,
      banking_pitch_response, objection_handling_response, lead_generation_strategy, confidence_rating,
      resume_filename, notice_period, expected_start_date, cover_note, ai_match_score, status
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'Submitted')
  `);

  stmt.run(
    'sales', full_name, email, phone, city || '', linkedin_url || '',
    compensation_choice || '100_commission', Number(commission_rate) || 15, Number(base_salary) || 0,
    Number(projected_monthly_sales) || 0, Number(estimated_monthly_payout) || 0,
    sales_experience_years || '', sales_methodology || '', highest_single_deal || '', avg_sales_cycle || '',
    primary_sales_channel || '', key_achievements || '', product_expertise || '',
    banking_pitch_response || '', objection_handling_response || '', lead_generation_strategy || '',
    Number(confidence_rating) || 4,
    resume_filename || '', notice_period || 'Immediate', expected_start_date || 'Immediate',
    cover_note || '', aiScore,
    function (err) {
      if (err) {
        console.error('Error inserting sales application:', err);
        return res.status(500).json({ error: 'Failed to submit application' });
      }
      return res.status(201).json({
        message: 'Sales Executive qualification application submitted successfully!',
        applicationId: this.lastID,
        aiMatchScore: aiScore
      });
    }
  );
  stmt.finalize();
});

// POST /api/applications/developer - Public Developer Application Submission
app.post('/api/applications/developer', (req, res) => {
  const {
    full_name, email, phone, city, linkedin_url, github_url,
    tech_stack, primary_domain, portfolio_url, years_dev_experience,
    resume_filename, notice_period, expected_start_date, cover_note
  } = req.body;

  if (!full_name || !email || !phone || !tech_stack) {
    return res.status(400).json({ error: 'Full name, email, phone, and technical stack are required.' });
  }

  let aiScore = 85;
  if (github_url) aiScore += 7;

  const stmt = db.prepare(`
    INSERT INTO applications (
      role_type, full_name, email, phone, city, linkedin_url, github_url,
      tech_stack, primary_domain, portfolio_url, years_dev_experience,
      resume_filename, notice_period, expected_start_date, cover_note, ai_match_score, status
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'Submitted')
  `);

  stmt.run(
    'developer', full_name, email, phone, city || '', linkedin_url || '', github_url || '',
    tech_stack, primary_domain || '', portfolio_url || '', years_dev_experience || '',
    resume_filename || '', notice_period || 'Immediate', expected_start_date || 'Immediate',
    cover_note || '', aiScore,
    function (err) {
      if (err) {
        console.error('Error inserting developer application:', err);
        return res.status(500).json({ error: 'Failed to submit application' });
      }
      return res.status(201).json({
        message: 'Developer application submitted successfully!',
        applicationId: this.lastID,
        aiMatchScore: aiScore
      });
    }
  );
  stmt.finalize();
});

// GET /api/applications - Protected (JWT): Fetch Candidate Applications
app.get('/api/applications', authenticateJWT, (req, res) => {
  const { role, status, search, compensation } = req.query;

  let query = `SELECT * FROM applications WHERE 1=1`;
  const params = [];

  if (role && role !== 'all') {
    query += ` AND role_type = ?`;
    params.push(role);
  }

  if (status && status !== 'all') {
    query += ` AND status = ?`;
    params.push(status);
  }

  if (compensation && compensation !== 'all') {
    query += ` AND compensation_choice = ?`;
    params.push(compensation);
  }

  if (search) {
    query += ` AND (full_name LIKE ? OR email LIKE ? OR phone LIKE ? OR tech_stack LIKE ? OR city LIKE ?)`;
    const searchPattern = `%${search}%`;
    params.push(searchPattern, searchPattern, searchPattern, searchPattern, searchPattern);
  }

  query += ` ORDER BY created_at DESC`;

  db.all(query, params, (err, rows) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to query database' });
    }
    return res.json({ applications: rows, count: rows.length });
  });
});

// GET /api/applications/:id - Protected (JWT): Fetch Single Dossier
app.get('/api/applications/:id', authenticateJWT, (req, res) => {
  db.get(`SELECT * FROM applications WHERE id = ?`, [req.params.id], (err, row) => {
    if (err || !row) {
      return res.status(404).json({ error: 'Application record not found' });
    }
    return res.json({ application: row });
  });
});

// PATCH /api/applications/:id/status - Protected (JWT): Update Application Status
app.patch('/api/applications/:id/status', authenticateJWT, (req, res) => {
  const { status } = req.body;
  const validStatuses = ['Submitted', 'Under Review', 'Shortlisted', 'Rejected'];

  if (!status || !validStatuses.includes(status)) {
    return res.status(400).json({ error: 'Invalid status provided.' });
  }

  db.run(
    `UPDATE applications SET status = ? WHERE id = ?`,
    [status, req.params.id],
    function (err) {
      if (err) {
        return res.status(500).json({ error: 'Failed to update status' });
      }
      return res.json({ message: 'Candidate status updated successfully', id: req.params.id, status });
    }
  );
});

// DELETE /api/applications/:id - Protected (JWT): Remove Application Record
app.delete('/api/applications/:id', authenticateJWT, (req, res) => {
  db.run(`DELETE FROM applications WHERE id = ?`, [req.params.id], function (err) {
    if (err) {
      return res.status(500).json({ error: 'Failed to delete application' });
    }
    return res.json({ message: 'Candidate application deleted', id: req.params.id });
  });
});

// GET /api/stats - Protected (JWT): Dashboard Key Performance Indicators & Analytics
app.get('/api/stats', authenticateJWT, (req, res) => {
  db.all(`SELECT role_type, compensation_choice, status FROM applications`, [], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to retrieve stats' });
    }

    const total = rows.length;
    const salesCount = rows.filter(r => r.role_type === 'sales').length;
    const devCount = rows.filter(r => r.role_type === 'developer').length;

    const commission100Count = rows.filter(r => r.compensation_choice === '100_commission').length;
    const salaryCommissionCount = rows.filter(r => r.compensation_choice === 'salary_commission').length;

    const shortlistedCount = rows.filter(r => r.status === 'Shortlisted').length;
    const underReviewCount = rows.filter(r => r.status === 'Under Review').length;
    const submittedCount = rows.filter(r => r.status === 'Submitted').length;
    const rejectedCount = rows.filter(r => r.status === 'Rejected').length;

    return res.json({
      total,
      salesCount,
      devCount,
      compensationSplit: {
        commission100: commission100Count,
        salaryCommission: salaryCommissionCount
      },
      statusSplit: {
        submitted: submittedCount,
        underReview: underReviewCount,
        shortlisted: shortlistedCount,
        rejected: rejectedCount
      }
    });
  });
});

// =========================================================================
// SEO / AEO ENDPOINTS (Sitemap & Robots.txt)
// =========================================================================

app.get('/sitemap.xml', (req, res) => {
  const baseUrl = 'https://careers.fillosoft.com';
  const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9
        http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">
  <url>
    <loc>${baseUrl}/</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>${baseUrl}/sales</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>${baseUrl}/developer</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>${baseUrl}/hr_admin</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.1</priority>
  </url>
</urlset>`;
  res.header('Content-Type', 'application/xml');
  res.send(sitemapXml);
});

app.get('/robots.txt', (req, res) => {
  const robotsTxt = `User-agent: *
Allow: /
Allow: /sales
Allow: /developer
Disallow: /hr_admin
Disallow: /admin
Disallow: /api/

Sitemap: https://careers.fillosoft.com/sitemap.xml`;
  res.header('Content-Type', 'text/plain');
  res.send(robotsTxt);
});

// Serve frontend build static files in production if available
const clientBuildPath = path.resolve(__dirname, '../client/dist');
if (fs.existsSync(clientBuildPath)) {
  app.use(express.static(clientBuildPath));
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(clientBuildPath, 'index.html'));
  });
}

// Start Server
app.listen(PORT, () => {
  console.log(`🚀 Fillosoft Careers Fullstack Express Server running on http://localhost:${PORT}`);
});
