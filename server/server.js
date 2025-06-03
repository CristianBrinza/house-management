const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const cors = require('cors');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Import rutele și Swagger
const authRoutes = require('./routes/authRoutes');
const setupSwagger = require('./swagger');

console.log('📦 Pornire aplicație...');

// Conectare la MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log(`✅ MongoDB connected la ${process.env.MONGO_URI}`))
  .catch((err) => console.error('❌ Eroare conectare MongoDB:', err));

app.use('/api/auth', (req, res, next) => {
  console.log(`➡️  [${new Date().toISOString()}] Ruta apelată: ${req.method} ${req.originalUrl}`);
  next();
}, authRoutes);

// Configurează Swagger
console.log('🔧 Configurare Swagger UI...');
setupSwagger(app);
console.log('✅ Swagger UI configurat la /api-docs');

// Pornire server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

// Tratare evenimente neprevăzute
process.on('uncaughtException', (err) => {
  console.error('❗ Uncaught Exception:', err);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('❗ Unhandled Rejection la:', promise, 'motiv:', reason);
});
