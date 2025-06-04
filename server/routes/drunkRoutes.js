// server/routes/drunkRoutes.js
const express = require('express');
const {
    getDrunkedDrinks,
    consumeDrink,
    updateDrunkedComment
} = require('../controllers/drunkController');
const authMiddleware = require('../middleware/authMiddleware');

console.log('🔀 drunkRoutes încărcat.');

const router = express.Router();
router.use(authMiddleware);

/**
 * @swagger
 * tags:
 *   name: Drunked
 *   description: Rute pentru băuturi consumate (DrunkedDrinks)
 */

/**
 * @swagger
 * /api/drunk:
 *   get:
 *     summary: Obține toate băuturile marcate ca „drunked”
 *     tags: [Drunked]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Listă de băuturi consumate
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
 *                   consumedAt:
 *                     type: string
 *                   comment:
 *                     type: string
 */
router.get('/', getDrunkedDrinks);

/**
 * @swagger
 * /api/drunk/{id}:
 *   put:
 *     summary: Marchează băutura cu {id} ca „drunked” (o mută) și o șterge din colecția `drinks`
 *     tags: [Drunked]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID-ul băuturii din colecția `drinks`
 *     responses:
 *       200:
 *         description: Băutura a fost consumată și mutată
 *       404:
 *         description: Băutura nu a fost găsită
 */
router.put('/:id', consumeDrink);

/**
 * @swagger
 * /api/drunk/{id}/comment:
 *   put:
 *     summary: Actualizează comentariul pentru băutura consumată (drunked)
 *     tags: [Drunked]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID-ul băuturii consumate
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [comment]
 *             properties:
 *               comment:
 *                 type: string
 *                 description: Comentariu nou (3–5 propoziții+)
 *     responses:
 *       200:
 *         description: Comentariu actualizat
 *       400:
 *         description: Date invalide
 *       404:
 *         description: Băutura nu a fost găsită
 */
router.put('/:id/comment', updateDrunkedComment);

module.exports = router;
