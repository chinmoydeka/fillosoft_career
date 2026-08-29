const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'fillosoft_careers_super_secret_jwt_key_2026';

function authenticateJWT(req, res, next) {
  const authHeader = req.headers.authorization;

  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];
    jwt.verify(token, JWT_SECRET, (err, user) => {
      if (err) {
        return res.status(403).json({ error: 'Token is invalid or expired. Please login again.' });
      }
      req.user = user;
      next();
    });
  } else {
    res.status(401).json({ error: 'Access denied. Authentication token required.' });
  }
}

module.exports = { authenticateJWT, JWT_SECRET };
