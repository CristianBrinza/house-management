const jwt = require('jsonwebtoken');
const User = require('../models/User');

console.log('🔐 authController încărcat.');

// Creează un token JWT pe baza ID-ului user-ului
const createToken = (user) => {
  console.log(`🔑 Generare token pentru user ${user.username} (ID: ${user._id})`);
  return jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
};

exports.register = async (req, res) => {
  console.log(`🆕 [${new Date().toISOString()}] Începe înregistrarea unui nou utilizator:`, req.body);
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      console.warn('⚠️ Lipsă username sau password în corpul cererii');
      return res.status(400).json({ error: 'Both username and password are required' });
    }

    console.log(`🔍 Se verifică dacă există deja user cu username="${username}"`);
    const existing = await User.findOne({ username });
    if (existing) {
      console.warn(`❌ Username "${username}" deja există în baza de date.`);
      return res.status(400).json({ error: 'Username already exists' });
    }

    console.log(`📝 Creare user nou: username="${username}"`);
    const user = await User.create({ username, password });
    console.log(`✅ Utilizator creat cu ID=${user._id}`);

    const token = createToken(user);
    console.log(`📤 Trimit token și info user către client.`);
    res.status(201).json({ token, user: { id: user._id, username: user.username } });
  } catch (err) {
    console.error('❌ Eroare în controller register:', err);
    res.status(500).json({ error: 'Server error during registration' });
  }
};

exports.login = async (req, res) => {
  console.log(`🔑 [${new Date().toISOString()}] Începe autentificare:`, req.body);
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      console.warn('⚠️ Lipsă username sau password în corpul cererii login');
      return res.status(400).json({ error: 'Both username and password are required' });
    }

    console.log(`🔍 Se caută user cu username="${username}"`);
    const user = await User.findOne({ username });
    if (!user) {
      console.warn(`❌ Nu s-a găsit user cu username="${username}". Autentificare eșuată.`);
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      console.warn(`❌ Password invalid pentru user "${username}". Autentificare eșuată.`);
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    console.log(`✅ User "${username}" autentificat cu succes.`);
    const token = createToken(user);
    console.log(`📤 Trimit token și info user către client.`);
    res.json({ token, user: { id: user._id, username: user.username } });
  } catch (err) {
    console.error('❌ Eroare în controller login:', err);
    res.status(500).json({ error: 'Server error during login' });
  }
};
