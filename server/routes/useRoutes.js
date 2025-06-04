// server/routes/useRoutes.js
const express = require('express');
const { createUse, getAllUseHistory } = require('../controllers/useController');
const authMiddleware = require('../middleware/authMiddleware');

console.log('🔀 useRoutes încărcat.');

const router = express.Router();

router.use(authMiddleware);

/**
 * @swagger
 * tags:
 *   name: Use
 *   description: Rute pentru scădere cantități (Use) și istorie
 */

/**
 * @swagger
 * /api/use:
 *   post:
 *     summary: Utilizează (scade) cantități din inventar, creează istorie
 *     tags: [Use]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               items:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                     name:
 *                       type: string
 *                     quantity:
 *                       type: number
 *             required: [items]
 *     responses:
 *       201:
 *         description: UseHistory creat
 *       400:
 *         description: Date invalide
 */
router.post('/', createUse);

/**
 * @swagger
 * /api/use:
 *   get:
 *     summary: Obține toate înregistrările de utilizare (istoric)
 *     tags: [Use]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de UseHistory
 *       500:
 *         description: Eroare server
 */
router.get('/', getAllUseHistory);

module.exports = router;
