// server/routes/drinkRoutes.js
const express = require('express');
const {
    getDrinks,
    createDrink,
    updateDrink,
    deleteDrink
} = require('../controllers/drinkController');
const authMiddleware = require('../middleware/authMiddleware');

console.log('🔀 drinkRoutes încărcat.');

const router = express.Router();
router.use(authMiddleware);

/**
 * @swagger
 * tags:
 *   name: Drinks
 *   description: Rute pentru gestionarea băuturilor
 */

/**
 * @swagger
 * /api/drinks:
 *   get:
 *     summary: Obține toate băuturile, cu opțiuni de filtrare
 *     tags: [Drinks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: name
 *         schema:
 *           type: string
 *         description: Filtrează după nume (regex insensitive)
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *         description: Filtrează după tip
 *     responses:
 *       200:
 *         description: Listă de băuturi
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
 *                   type:
 *                     type: string
 *                   date:
 *                     type: string
 *                   price:
 *                     type: number
 */
router.get('/', getDrinks);

/**
 * @swagger
 * /api/drinks:
 *   post:
 *     summary: Creează o băutură nouă
 *     tags: [Drinks]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, type, date, price]
 *             properties:
 *               name:
 *                 type: string
 *               type:
 *                 type: string
 *               date:
 *                 type: string
 *                 description: Format YYYY-MM
 *               price:
 *                 type: number
 *     responses:
 *       201:
 *         description: Băutură creată
 *       400:
 *         description: Date invalide
 */
router.post('/', createDrink);

/**
 * @swagger
 * /api/drinks/{id}:
 *   put:
 *     summary: Actualizează o băutură existentă
 *     tags: [Drinks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID-ul băuturii
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               type:
 *                 type: string
 *               date:
 *                 type: string
 *               price:
 *                 type: number
 *     responses:
 *       200:
 *         description: Băutură actualizată
 *       404:
 *         description: Băutura nu a fost găsită
 *       400:
 *         description: Date invalide
 */
router.put('/:id', updateDrink);

/**
 * @swagger
 * /api/drinks/{id}:
 *   delete:
 *     summary: Șterge o băutură
 *     tags: [Drinks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID-ul băuturii de șters
 *     responses:
 *       200:
 *         description: Băutură ștearsă
 *       404:
 *         description: Băutura nu a fost găsită
 */
router.delete('/:id', deleteDrink);

module.exports = router;
