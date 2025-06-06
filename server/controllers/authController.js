// server/controllers/authController.js
const jwt = require('jsonwebtoken');
const User = require('../models/User');

console.log('🔄 authController încărcat.');

exports.register = async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ error: 'Username și password sunt obligatorii.' });
    }
    const existing = await User.findOne({ username });
    if (existing) {
      return res.status(400).json({ error: 'Username deja există.' });
    }
    const newUser = new User({ username, password });
    await newUser.save();
    console.log(`✅ User creat: ${username}`);
    return res.status(201).json({ message: 'User creat cu succes.' });
  } catch (err) {
    console.error('❌ Eroare la register:', err);
    return res.status(500).json({ error: 'Server error la înregistrare.' });
  }
};

exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ error: 'Username și password sunt obligatorii.' });
    }
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ error: 'Credențiale invalide.' });
    }
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Credențiale invalide.' });
    }
    // Semnăm tokenul fără expirare (nu includem expiresIn)
    const payload = { id: user._id, username: user.username };
    const token = jwt.sign(payload, process.env.JWT_SECRET);
    console.log(`✅ Login reușit pentru user: ${username}`);
    return res.json({ user: { id: user._id, username: user.username }, token });
  } catch (err) {
    console.error('❌ Eroare la login:', err);
    return res.status(500).json({ error: 'Server error la autentificare.' });
  }
};

// Endpoint pentru validarea token-ului (GET /api/auth/me)
exports.getCurrentUser = async (req, res) => {
  try {
    // Aici authMiddleware deja a setat req.user după decodarea tokenului
    const { id, username } = req.user;
    return res.json({ id, username });
  } catch (err) {
    console.error('❌ Eroare la getCurrentUser:', err);
    return res.status(500).json({ error: 'Server error la validare token.' });
  }
};
