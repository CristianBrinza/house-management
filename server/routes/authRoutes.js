// server/routes/authRoutes.js
const express = require('express');
const {
  register,
  login,
  getCurrentUser
} = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

console.log('🔀 authRoutes încărcat.');

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
 *         description: Username deja există sau date invalide
 */
// router.post('/register', register);

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
 *         description: Autentificare reușită (returnează token)
 *       401:
 *         description: Credențiale invalide
 */
router.post(
    '/login',
    (req, res, next) => {
      console.log(`➡️  [${new Date().toISOString()}] Ruta POST /api/auth/login apelată.`);
      next();
    },
    login
);

/**
 * @swagger
 * /api/auth/me:
 *   get:
 *     summary: Returnează utilizatorul curent (verifică token)
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Informații utilizator (id, username)
 *       401:
 *         description: Lipsește token sau token invalid
 */
router.get('/me', authMiddleware, getCurrentUser);

module.exports = router;
