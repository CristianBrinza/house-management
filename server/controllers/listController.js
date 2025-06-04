// server/controllers/listController.js
const ShoppingList = require('../models/ShoppingList');
const InventoryItem = require('../models/InventoryItem');

console.log('🔄 listController încărcat.');

// Creează o listă nouă
// POST /api/lists  { name: string }
exports.createList = async (req, res) => {
    try {
        const { name } = req.body;
        if (!name || name.trim() === '') {
            return res.status(400).json({ error: 'Name este obligatoriu.' });
        }
        const existing = await ShoppingList.findOne({ name: name.trim() });
        if (existing) {
            return res.status(400).json({ error: 'Există deja o listă cu acest nume.' });
        }
        const newList = await ShoppingList.create({ name: name.trim(), items: [] });
        console.log(`✅ ShoppingList creat: ${newList.name}`);
        res.status(201).json(newList);
    } catch (err) {
        console.error('❌ Eroare la createList:', err);
        res.status(500).json({ error: 'Server error la creare listă.' });
    }
};

// GET /api/lists  - listele existente
exports.getAllLists = async (req, res) => {
    try {
        console.log(`📦 [${new Date().toISOString()}] getAllLists`);
        const lists = await ShoppingList.find().sort({ createdAt: -1 });
        res.json(lists);
    } catch (err) {
        console.error('❌ Eroare la getAllLists:', err);
        res.status(500).json({ error: 'Server error la get lists.' });
    }
};

// DELETE /api/lists/:id  - șterge întreagă listă
exports.deleteList = async (req, res) => {
    try {
        const { id } = req.params;
        console.log(`🗑️ [${new Date().toISOString()}] deleteList ID=${id}`);
        const del = await ShoppingList.findByIdAndDelete(id);
        if (!del) {
            return res.status(404).json({ error: 'Listă nu a fost găsită.' });
        }
        res.json({ message: 'Listă ștearsă.' });
    } catch (err) {
        console.error('❌ Eroare la deleteList:', err);
        res.status(500).json({ error: 'Server error la delete list.' });
    }
};

// POST /api/lists/:id/items  - adaugă un item în listă
// Body: { name: string, quantity: number }
exports.addItemToList = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, quantity } = req.body;
        console.log(`➕ [${new Date().toISOString()}] addItemToList ${name} (${quantity}) la list ${id}`);

        if (!name || quantity == null || quantity <= 0) {
            return res.status(400).json({ error: 'Name și quantity > 0 sunt obligatorii.' });
        }

        const list = await ShoppingList.findById(id);
        if (!list) {
            return res.status(404).json({ error: 'Listă nu a fost găsită.' });
        }

        // verific dacă există deja un item cu același name
        const existingItem = list.items.find((it) => it.name === name.trim());
        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            list.items.push({ name: name.trim(), quantity });
        }

        await list.save();
        res.json(list);
    } catch (err) {
        console.error('❌ Eroare la addItemToList:', err);
        res.status(500).json({ error: 'Server error la add item.' });
    }
};

// DELETE /api/lists/:listId/items/:itemName  - șterge un item din listă
exports.deleteItemFromList = async (req, res) => {
    try {
        const { listId, itemName } = req.params;
        console.log(`❌ [${new Date().toISOString()}] deleteItemFromList ${itemName} din list ${listId}`);
        const list = await ShoppingList.findById(listId);
        if (!list) {
            return res.status(404).json({ error: 'Listă nu a fost găsită.' });
        }
        list.items = list.items.filter((it) => it.name !== itemName);
        await list.save();
        res.json(list);
    } catch (err) {
        console.error('❌ Eroare la deleteItemFromList:', err);
        res.status(500).json({ error: 'Server error la delete item.' });
    }
};

// POST /api/lists/:listId/buy/:itemName
// Body: { quantity: number }
// Când un item e „achiziționat” din listă, facem:
//  1. scădem/ridicăm în Inventory (fie adăugăm nou, fie creăm nou InventoryItem)
//  2. eliminăm itemul din listă (sau îl păstrăm, după preferință)
exports.buyItemFromList = async (req, res) => {
    try {
        const { listId, itemName } = req.params;
        const { quantity } = req.body;

        if (!itemName || quantity == null || quantity <= 0) {
            return res.status(400).json({ error: 'Quantity > 0 și itemName sunt obligatorii.' });
        }

        console.log(`🛒 [${new Date().toISOString()}] buyItemFromList ${itemName} (${quantity}) din list ${listId}`);

        const list = await ShoppingList.findById(listId);
        if (!list) {
            return res.status(404).json({ error: 'Listă nu a fost găsită.' });
        }

        // Caut/inventory
        let inv = await InventoryItem.findOne({ name: itemName });
        if (inv) {
            inv.quantity += quantity;
            await inv.save();
        } else {
            inv = await InventoryItem.create({
                name: itemName,
                quantity,
                type: 'Else',    // implicităm Else, poți schimba după nevoie
                sub_type: 'Else' // implicităm Else
            });
        }

        // Șterg item din listă
        list.items = list.items.filter((it) => it.name !== itemName);
        await list.save();

        res.json({ list, inventoryItem: inv });
    } catch (err) {
        console.error('❌ Eroare la buyItemFromList:', err);
        res.status(500).json({ error: 'Server error la buy item.' });
    }
};
