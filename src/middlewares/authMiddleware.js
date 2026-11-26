const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.status(401).json({ message: 'Access token tidak ditemukan' });

  jwt.verify(token, process.env.JWT_ACCESS_SECRET, (err, decoded) => {
    if (err) return res.status(401).json({ message: 'Access token tidak valid atau kedaluwarsa' });
    if (decoded.role !== 'ROLE_USER') {
      return res.status(403).json({ message: 'Akses ditolak: peran tidak valid' });
    }
    req.user = decoded; // { id, role }
    next();
  });
};

module.exports = verifyToken;