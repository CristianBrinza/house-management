// server/routes/typeRoutes.js
const express = require('express');
const { getAllTypes } = require('../controllers/typeController');

console.log('🔀 typeRoutes încărcat.');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Types
 *   description: Rute pentru Tipuri și Subtipuri
 */

/**
 * @swagger
 * /api/types:
 *   get:
 *     summary: Obține toate tipurile cu subtipurile lor
 *     tags: [Types]
 *     responses:
 *       200:
 *         description: Lista de tipuri
 *       500:
 *         description: Eroare server
 */
router.get('/', getAllTypes);

module.exports = router;
