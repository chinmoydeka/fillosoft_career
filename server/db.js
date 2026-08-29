const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const bcrypt = require('bcryptjs');

const dbPath = path.resolve(__dirname, 'fillosoft_careers.db');
const db = new sqlite3.Database(dbPath);

db.serialize(() => {
  // Create Admin Users Table
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      role TEXT DEFAULT 'admin',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Create Applications Table
  db.run(`
    CREATE TABLE IF NOT EXISTS applications (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      role_type TEXT NOT NULL, -- 'sales' or 'developer'
      full_name TEXT NOT NULL,
      email TEXT NOT NULL,
      phone TEXT NOT NULL,
      city TEXT NOT NULL,
      linkedin_url TEXT,
      github_url TEXT,
      
      -- Sales specific fields
      compensation_choice TEXT, -- '100_commission' or 'salary_commission'
      commission_rate REAL DEFAULT 0,
      base_salary REAL DEFAULT 0,
      projected_monthly_sales REAL DEFAULT 0,
      estimated_monthly_payout REAL DEFAULT 0,
      sales_experience_years TEXT,
      avg_deal_size TEXT,
      primary_sales_channel TEXT,
      key_achievements TEXT,

      -- Developer specific fields
      tech_stack TEXT,
      primary_domain TEXT,
      portfolio_url TEXT,
      years_dev_experience TEXT,

      -- Metadata & System
      resume_filename TEXT,
      notice_period TEXT,
      expected_start_date TEXT,
      cover_note TEXT,
      sales_methodology TEXT,
      highest_single_deal TEXT,
      avg_sales_cycle TEXT,
      product_expertise TEXT,
      banking_pitch_response TEXT,
      objection_handling_response TEXT,
      lead_generation_strategy TEXT,
      confidence_rating INTEGER,
      ai_match_score INTEGER DEFAULT 85,
      status TEXT DEFAULT 'Submitted', -- 'Submitted', 'Under Review', 'Shortlisted', 'Rejected'
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Migration helper for adding columns to existing database
  const extraColumns = [
    'sales_methodology TEXT',
    'highest_single_deal TEXT',
    'avg_sales_cycle TEXT',
    'product_expertise TEXT',
    'banking_pitch_response TEXT',
    'objection_handling_response TEXT',
    'lead_generation_strategy TEXT',
    'confidence_rating INTEGER'
  ];

  extraColumns.forEach((col) => {
    db.run(`ALTER TABLE applications ADD COLUMN ${col}`, () => {});
  });

  // Seed default admin user if not exists
  db.get(`SELECT * FROM users WHERE email = ?`, ['admin@fillosoft.com'], (err, user) => {
    if (!user) {
      const salt = bcrypt.genSaltSync(10);
      const hash = bcrypt.hashSync('admin123', salt);
      db.run(
        `INSERT INTO users (username, email, password_hash, role) VALUES (?, ?, ?, ?)`,
        ['HR Admin', 'admin@fillosoft.com', hash, 'admin']
      );
      console.log('✅ Default HR Admin created: admin@fillosoft.com / admin123');
    }
  });

  // Seed realistic sample applications if empty
  db.get(`SELECT COUNT(*) as count FROM applications`, (err, row) => {
    if (row && row.count === 0) {
      console.log('🌱 Seeding initial candidate application records...');

      const sampleSales1 = [
        'sales', 'Vikram Sharma', 'vikram.sales@example.com', '+91 9876543210', 'Guwahati',
        'https://linkedin.com/in/vikram-sharma-sales', null,
        '100_commission', 15.0, 0, 500000, 75000,
        '4-6 years', '₹1,00,000 - ₹5,00,000', 'B2B SaaS & IT Software',
        'Closed 42 enterprise software deals in 2024; average target achievement 140%.',
        null, null, null, null,
        'vikram_sharma_cv.pdf', '15 Days', 'Immediate',
        'Excited about Fillosoft software product line. I thrive on 100% commission models.',
        94, 'Shortlisted'
      ];

      const sampleSales2 = [
        'sales', 'Ananya Roy', 'ananya.roy@example.com', '+91 8765432109', 'Kolkata',
        'https://linkedin.com/in/ananya-roy', null,
        'salary_commission', 5.0, 25000, 400000, 45000,
        '2-4 years', '₹50,000 - ₹2,00,000', 'Outbound Sales & Demos',
        'Generated over ₹50L revenue for cloud software product in past 12 months.',
        null, null, null, null,
        'ananya_roy_resume.pdf', '1 Month', 'Within 2 weeks',
        'Prefer structured base salary with steady 5% performance commission.',
        88, 'Under Review'
      ];

      const sampleDev1 = [
        'developer', 'Rahul Das', 'rahul.dev@example.com', '+91 7654321098', 'Guwahati',
        'https://linkedin.com/in/rahul-das-dev', 'https://github.com/rahuldas-dev',
        null, 0, 0, 0, 0,
        null, null, null, null,
        'React, TypeScript, Node.js, Express, SQLite, TailwindCSS, REST APIs',
        'Full-Stack Web Development', 'https://rahuldas.dev', '3+ years',
        'rahul_das_fullstack_cv.pdf', 'Immediate', 'Immediate',
        'Built multiple fullstack SaaS applications. Proficient in modern web tech.',
        92, 'Submitted'
      ];

      const insertStmt = db.prepare(`
        INSERT INTO applications (
          role_type, full_name, email, phone, city, linkedin_url, github_url,
          compensation_choice, commission_rate, base_salary, projected_monthly_sales, estimated_monthly_payout,
          sales_experience_years, avg_deal_size, primary_sales_channel, key_achievements,
          tech_stack, primary_domain, portfolio_url, years_dev_experience,
          resume_filename, notice_period, expected_start_date, cover_note, ai_match_score, status
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);

      insertStmt.run(sampleSales1);
      insertStmt.run(sampleSales2);
      insertStmt.run(sampleDev1);
      insertStmt.finalize();
      console.log('✅ Sample candidates seeded.');
    }
  });
});

module.exports = db;
