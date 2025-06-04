// server/routes/typeRoutes.js
const express = require('express');
const {
    getAllTypes,
    createType,
    updateType,
    deleteType,
    addSubType,
    renameSubType,
    deleteSubType
} = require('../controllers/typeController');
const authMiddleware = require('../middleware/authMiddleware');

console.log('🔀 typeRoutes încărcat.');

const router = express.Router();

// Toate rutele sunt protejate de autentificare
router.use(authMiddleware);

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

/**
 * @swagger
 * /api/types:
 *   post:
 *     summary: Creează un tip nou
 *     tags: [Types]
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
 *         description: Tip creat
 *       400:
 *         description: Date invalide
 */
router.post('/', createType);

/**
 * @swagger
 * /api/types/{id}:
 *   put:
 *     summary: Actualizează numele unui tip
 *     tags: [Types]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID-ul tipului
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
 *       200:
 *         description: Tip actualizat
 *       400:
 *         description: Date invalide sau conflict
 *       404:
 *         description: Tip nu a fost găsit
 */
router.put('/:id', updateType);

/**
 * @swagger
 * /api/types/{id}:
 *   delete:
 *     summary: Șterge un tip
 *     tags: [Types]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID-ul tipului
 *     responses:
 *       200:
 *         description: Tip șters
 *       404:
 *         description: Tip nu a fost găsit
 */
router.delete('/:id', deleteType);

/**
 * @swagger
 * /api/types/{id}/subtypes:
 *   post:
 *     summary: Adaugă un subtip la tipul cu ID-ul {id}
 *     tags: [Types]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID-ul tipului
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
 *       200:
 *         description: Subtip adăugat
 *       400:
 *         description: Date invalide sau subtip duplicat
 *       404:
 *         description: Tip nu a fost găsit
 */
router.post('/:id/subtypes', addSubType);

/**
 * @swagger
 * /api/types/{id}/subtypes:
 *   put:
 *     summary: Schimbă numele unui subtip al tipului cu ID-ul {id}
 *     tags: [Types]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID-ul tipului
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [oldName, newName]
 *             properties:
 *               oldName:
 *                 type: string
 *               newName:
 *                 type: string
 *     responses:
 *       200:
 *         description: Subtip redenumit
 *       400:
 *         description: Date invalide sau subtipul vechi nu există / noul subtip deja există
 *       404:
 *         description: Tip nu a fost găsit
 */
router.put('/:id/subtypes', renameSubType);

/**
 * @swagger
 * /api/types/{id}/subtypes:
 *   delete:
 *     summary: Șterge un subtip de la tipul cu ID-ul {id}
 *     tags: [Types]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID-ul tipului
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
 *       200:
 *         description: Subtip șters
 *       400:
 *         description: Date invalide sau subtip nu există
 *       404:
 *         description: Tip nu a fost găsit
 */
router.delete('/:id/subtypes', deleteSubType);

module.exports = router;
