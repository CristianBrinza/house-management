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

const setupSwagger = require('./swagger');

console.log('🌐 Variabile de mediu încărcate:');
console.log('  PORT       =', process.env.PORT);
console.log('  MONGO_URI  =', process.env.MONGO_URI ? process.env.MONGO_URI : '(undefined)');
console.log('  JWT_SECRET =', process.env.JWT_SECRET ? '••••••••••' : '(undefined)');

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log(`✅ MongoDB connected la ${process.env.MONGO_URI}`))
    .catch((err) => console.error('❌ Eroare conectare MongoDB:', err));

const authRoutes = require('./routes/authRoutes');
app.use('/api/auth', (req, res, next) => {
  console.log(`➡️  [${new Date().toISOString()}] Ruta apelată: ${req.method} ${req.originalUrl}`);
  next();
}, authRoutes);

const inventoryRoutes = require('./routes/inventoryRoutes');
app.use('/api/inventory', inventoryRoutes);
const typeRoutes = require('./routes/typeRoutes');
app.use('/api/types', typeRoutes);
const useRoutes = require('./routes/useRoutes');
app.use('/api/use', useRoutes);
const listRoutes = require('./routes/listRoutes');
app.use('/api/lists', listRoutes);
const typeDrinkRoutes = require('./routes/drinkTypeRoutes');
app.use('/api/drink-types', typeDrinkRoutes);
const drinkRoutes = require('./routes/drinkRoutes');
app.use('/api/drinks', drinkRoutes);
const drunkRoutes = require('./routes/drunkRoutes');
app.use('/api/drunk', drunkRoutes);

app.get('/health', (req, res) => {
  if (req.query.token !== process.env.HEALTH_TOKEN) {
    return res.status(403).json({ error: 'Forbidden' });
  }
  res.status(200).json({ status: 'ok' });
});

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
