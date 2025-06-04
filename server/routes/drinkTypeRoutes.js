// server/routes/drinkTypeRoutes.js
const express = require('express');
const {
    getAllTypes,
    createType,
    updateType,
    deleteType
} = require('../controllers/drinkTypeController');
const authMiddleware = require('../middleware/authMiddleware');

console.log('🔀 drinkTypeRoutes încărcat.');

const router = express.Router();
router.use(authMiddleware);

/**
 * @swagger
 * tags:
 *   name: DrinkTypes
 *   description: Rute pentru gestionarea tipurilor de băuturi (doar `name`)
 */

/**
 * @swagger
 * /api/drink-types:
 *   get:
 *     summary: Obține toate tipurile de băuturi
 *     tags: [DrinkTypes]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Listă de tipuri
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                   name:
 *                     type: string
 */
router.get('/', getAllTypes);

/**
 * @swagger
 * /api/drink-types:
 *   post:
 *     summary: Creează un nou tip de băutură
 *     tags: [DrinkTypes]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name]
 *             properties:
 *               name:
 *                 type: string
 *     responses:
 *       201:
 *         description: Tip creat cu succes
 *       400:
 *         description: Date invalide sau tip duplicat
 */
router.post('/', createType);

/**
 * @swagger
 * /api/drink-types/{id}:
 *   put:
 *     summary: Actualizează un tip existent de băutură
 *     tags: [DrinkTypes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID-ul tipului de băutură de actualizat
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *     responses:
 *       200:
 *         description: Tip actualizat
 *       404:
 *         description: Tip nu a fost găsit
 *       400:
 *         description: Date invalide sau duplicat
 */
router.put('/:id', updateType);

/**
 * @swagger
 * /api/drink-types/{id}:
 *   delete:
 *     summary: Șterge un tip de băutură
 *     tags: [DrinkTypes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID-ul tipului de băutură de șters
 *     responses:
 *       200:
 *         description: Tip șters
 *       404:
 *         description: Tip nu a fost găsit
 */
router.delete('/:id', deleteType);

module.exports = router;
