// routes/authRoutes.js
const express = require('express');
const { register, login } = require('../controllers/authController');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Rute de autentificare
 */

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Înregistrează un utilizator nou
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: Utilizator creat cu succes
 *       400:
 *         description: Username deja există
 */
// router.post('/register', register);
// router.post('/register', (req, res, next) => {
//   console.log(`➡️  [${new Date().toISOString()}] Ruta POST /api/auth/register apelată.`);
//   next();
// }, register);

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Autentifică un utilizator
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Autentificare reușită
 *       401:
 *         description: Credențiale invalide
 */
router.post('/login', (req, res, next) => {
  console.log(`➡️  [${new Date().toISOString()}] Ruta POST /api/auth/login apelată.`);
  next();
}, login);

module.exports = router;
