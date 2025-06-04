// server/routes/inventoryRoutes.js
const express = require('express');
const {
    getInventory,
    getInventoryById,
    createInventory,
    updateInventory,
    deleteInventory
} = require('../controllers/inventoryController');
const authMiddleware = require('../middleware/authMiddleware');

console.log('🔀 inventoryRoutes încărcat.');

const router = express.Router();

// Toate rutele sunt protejate de autentificare
router.use(authMiddleware);

/**
 * @swagger
 * tags:
 *   name: Inventory
 *   description: Rute CRUD pentru Inventory
 */

/**
 * @swagger
 * /api/inventory:
 *   get:
 *     summary: Obține lista de inventory, cu opțiuni de filtrare
 *     tags: [Inventory]
 *     parameters:
 *       - in: query
 *         name: name
 *         schema:
 *           type: string
 *         description: Filtrează după nume (partial, case-insensitive)
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *         description: Filtrează după tip (exact)
 *       - in: query
 *         name: sub_type
 *         schema:
 *           type: string
 *         description: Filtrează după subtip (exact)
 *     responses:
 *       200:
 *         description: Lista de itemi
 *       500:
 *         description: Eroare server
 */
router.get('/', getInventory);

/**
 * @swagger
 * /api/inventory/{id}:
 *   get:
 *     summary: Obține un singur item după ID
 *     tags: [Inventory]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID-ul itemului
 *     responses:
 *       200:
 *         description: Itemul găsit
 *       404:
 *         description: Itemul nu a fost găsit
 */
router.get('/:id', getInventoryById);

/**
 * @swagger
 * /api/inventory:
 *   post:
 *     summary: Creează un item nou în inventory
 *     tags: [Inventory]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, quantity, type, sub_type]
 *             properties:
 *               name:
 *                 type: string
 *               quantity:
 *                 type: number
 *               type:
 *                 type: string
 *               sub_type:
 *                 type: string
 *     responses:
 *       201:
 *         description: Item creat
 *       400:
 *         description: Date invalide
 */
router.post('/', createInventory);

/**
 * @swagger
 * /api/inventory/{id}:
 *   put:
 *     summary: Actualizează un item existent
 *     tags: [Inventory]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID-ul itemului
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               quantity:
 *                 type: number
 *               type:
 *                 type: string
 *               sub_type:
 *                 type: string
 *     responses:
 *       200:
 *         description: Item actualizat
 *       404:
 *         description: Itemul nu a fost găsit
 */
router.put('/:id', updateInventory);

/**
 * @swagger
 * /api/inventory/{id}:
 *   delete:
 *     summary: Șterge un item
 *     tags: [Inventory]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID-ul itemului
 *     responses:
 *       200:
 *         description: Item șters
 *       404:
 *         description: Itemul nu a fost găsit
 */
router.delete('/:id', deleteInventory);

module.exports = router;
