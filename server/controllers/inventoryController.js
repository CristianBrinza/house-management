// server/controllers/inventoryController.js
const InventoryItem = require('../models/InventoryItem');

console.log('🔄 inventoryController încărcat.');

// Listare + căutare (după name, type și/sau sub_type)
exports.getInventory = async (req, res) => {
    try {
        const { name, type, sub_type } = req.query;
        console.log(`🛒 [${new Date().toISOString()}] getInventory cu filter:`, {
            name, type, sub_type
        });

        const filter = {};
        if (name) {
            filter.name = { $regex: name, $options: 'i' };
        }
        if (type) {
            filter.type = type; // exact match pe tip
        }
        if (sub_type) {
            filter.sub_type = sub_type; // exact match pe subtip
        }

        const items = await InventoryItem.find(filter).sort({ createdAt: -1 });
        console.log(`✅ S-au găsit ${items.length} itemi.`);
        res.json(items);
    } catch (err) {
        console.error('❌ Eroare la getInventory:', err);
        res.status(500).json({ error: 'Server error fetching inventory' });
    }
};

// Obține un singur item
exports.getInventoryById = async (req, res) => {
    try {
        const { id } = req.params;
        console.log(`🔍 [${new Date().toISOString()}] getInventoryById pentru ID=${id}`);
        const item = await InventoryItem.findById(id);
        if (!item) {
            console.warn(`⚠️ Nu a fost găsit item cu ID=${id}`);
            return res.status(404).json({ error: 'Item not found' });
        }
        res.json(item);
    } catch (err) {
        console.error('❌ Eroare la getInventoryById:', err);
        res.status(500).json({ error: 'Server error fetching inventory item' });
    }
};

// Creare item nou
exports.createInventory = async (req, res) => {
    try {
        const { name, quantity, type, sub_type } = req.body;
        console.log(`🆕 [${new Date().toISOString()}] createInventory:`, {
            name, quantity, type, sub_type
        });

        if (!name || quantity == null || !type || !sub_type) {
            console.warn('⚠️ Lipsesc câmpuri obligatorii (name, quantity, type, sub_type).');
            return res.status(400).json({ error: 'name, quantity, type and sub_type are required' });
        }

        const newItem = await InventoryItem.create({ name, quantity, type, sub_type });
        console.log(`✅ Inventory creat cu ID=${newItem._id}`);
        res.status(201).json(newItem);
    } catch (err) {
        console.error('❌ Eroare la createInventory:', err);
        res.status(500).json({ error: 'Server error creating inventory item' });
    }
};

// Actualizare item existent
exports.updateInventory = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, quantity, type, sub_type } = req.body;
        console.log(`✏️ [${new Date().toISOString()}] updateInventory ID=${id}:`, {
            name, quantity, type, sub_type
        });

        const item = await InventoryItem.findById(id);
        if (!item) {
            console.warn(`⚠️ Nu a fost găsit item cu ID=${id} pentru update`);
            return res.status(404).json({ error: 'Item not found' });
        }

        if (name != null) item.name = name;
        if (quantity != null) item.quantity = quantity;
        if (type != null) item.type = type;
        if (sub_type != null) item.sub_type = sub_type;

        const updated = await item.save();
        console.log(`✅ Inventory ID=${id} a fost actualizat`);
        res.json(updated);
    } catch (err) {
        console.error('❌ Eroare la updateInventory:', err);
        res.status(500).json({ error: 'Server error updating inventory item' });
    }
};

// Ștergere item
exports.deleteInventory = async (req, res) => {
    try {
        const { id } = req.params;
        console.log(`🗑️ [${new Date().toISOString()}] deleteInventory ID=${id}`);

        const deleted = await InventoryItem.findByIdAndDelete(id);
        if (!deleted) {
            console.warn(`⚠️ Nu a fost găsit item cu ID=${id} pentru ștergere`);
            return res.status(404).json({ error: 'Item not found' });
        }
        console.log(`✅ Inventory ID=${id} a fost șters`);
        res.json({ message: 'Item deleted' });
    } catch (err) {
        console.error('❌ Eroare la deleteInventory:', err);
        res.status(500).json({ error: 'Server error deleting inventory item' });
    }
};
