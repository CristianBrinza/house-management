const jwt = require('jsonwebtoken');

console.log('🔒 authMiddleware încărcat.');

module.exports = (req, res, next) => {
  console.log(`🔍 Verificare token pentru ruta protejată: ${req.method} ${req.originalUrl}`);

  const authHeader = req.headers.authorization;
  if (!authHeader) {
    console.warn('⚠️ Lipsește header-ul Authorization.');
    return res.status(401).json({ error: 'Unauthorized: lipsește token-ul' });
  }

  const token = authHeader.split(' ')[1];
  if (!token) {
    console.warn('⚠️ Header Authorization există, dar lipsește token-ul în format Bearer.');
    return res.status(401).json({ error: 'Unauthorized: token invalid' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log(`✅ Token valid pentru user ID=${decoded.id}.`);
    req.user = decoded;
    next();
  } catch (err) {
    console.warn('❌ Token invalid sau expirat:', err.message);
    return res.status(403).json({ error: 'Invalid token' });
  }
};
