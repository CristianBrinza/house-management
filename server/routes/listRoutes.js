// server/routes/listRoutes.js
const express = require('express');
const {
    createList,
    getAllLists,
    deleteList,
    addItemToList,
    deleteItemFromList,
    buyItemFromList
} = require('../controllers/listController');
const authMiddleware = require('../middleware/authMiddleware');

console.log('🔀 listRoutes încărcat.');

const router = express.Router();

router.use(authMiddleware);

/**
 * @swagger
 * tags:
 *   name: Lists
 *   description: Rute pentru Shopping Lists
 */

/**
 * @swagger
 * /api/lists:
 *   post:
 *     summary: Creează o listă nouă
 *     tags: [Lists]
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
 *         description: Listă creată
 *       400:
 *         description: Date invalide
 */
router.post('/', createList);

/**
 * @swagger
 * /api/lists:
 *   get:
 *     summary: Obține toate listele
 *     tags: [Lists]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de ShoppingList
 *       500:
 *         description: Eroare server
 */
router.get('/', getAllLists);

/**
 * @swagger
 * /api/lists/{id}:
 *   delete:
 *     summary: Șterge o listă
 *     tags: [Lists]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID-ul listei
 *     responses:
 *       200:
 *         description: Listă ștearsă
 *       404:
 *         description: Listă nu a fost găsită
 */
router.delete('/:id', deleteList);

/**
 * @swagger
 * /api/lists/{id}/items:
 *   post:
 *     summary: Adaugă un item în lista {id}
 *     tags: [Lists]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID-ul listei
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, quantity]
 *             properties:
 *               name:
 *                 type: string
 *               quantity:
 *                 type: number
 *     responses:
 *       200:
 *         description: Listă actualizată
 *       404:
 *         description: Listă nu a fost găsită
 */
router.post('/:id/items', addItemToList);

/**
 * @swagger
 * /api/lists/{listId}/items/{itemName}:
 *   delete:
 *     summary: Șterge itemul {itemName} din lista {listId}
 *     tags: [Lists]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: listId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID-ul listei
 *       - in: path
 *         name: itemName
 *         required: true
 *         schema:
 *           type: string
 *         description: Numele itemului
 *     responses:
 *       200:
 *         description: Listă actualizată
 *       404:
 *         description: Listă nu a fost găsită
 */
router.delete('/:listId/items/:itemName', deleteItemFromList);

/**
 * @swagger
 * /api/lists/{listId}/buy/{itemName}:
 *   post:
 *     summary: Marchează itemul {itemName} ca ”cumpărat” (adăugat în inventory) și îl șterge din listă
 *     tags: [Lists]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: listId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID-ul listei
 *       - in: path
 *         name: itemName
 *         required: true
 *         schema:
 *           type: string
 *         description: Numele itemului
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [quantity]
 *             properties:
 *               quantity:
 *                 type: number
 *     responses:
 *       200:
 *         description: Listă și Inventory actualizate
 *       404:
 *         description: Listă nu a fost găsită
 */
router.post('/:listId/buy/:itemName', buyItemFromList);

module.exports = router;
