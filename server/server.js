// server.js
const dotenv = require('dotenv');
dotenv.config(); // ===> încarcă .env încă de la început

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

console.log('📦 Pornire aplicație...');

const app = express();
app.use(cors());
app.use(express.json());

const authRoutes = require('./routes/authRoutes');
const setupSwagger = require('./swagger');

console.log('🌐 Variabile de mediu încărcate:');
console.log('  PORT       =', process.env.PORT);
console.log('  MONGO_URI  =', process.env.MONGO_URI ? process.env.MONGO_URI : '(undefined)');
console.log('  JWT_SECRET =', process.env.JWT_SECRET ? '••••••••••' : '(undefined)');

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log(`✅ MongoDB connected la ${process.env.MONGO_URI}`))
    .catch((err) => console.error('❌ Eroare conectare MongoDB:', err));

app.use('/api/auth', (req, res, next) => {
  console.log(`➡️  [${new Date().toISOString()}] Ruta apelată: ${req.method} ${req.originalUrl}`);
  next();
}, authRoutes);

console.log('🔧 Configurare Swagger UI...');
setupSwagger(app);
console.log('✅ Swagger UI configurat la /api-docs');

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

// Tratare erori neprevăzute
process.on('uncaughtException', (err) => {
  console.error('❗ Uncaught Exception:', err);
  process.exit(1);
});
process.on('unhandledRejection', (reason, promise) => {
  console.error('❗ Unhandled Rejection la:', promise, 'motiv:', reason);
});
