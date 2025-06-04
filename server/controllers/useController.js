// server/controllers/useController.js
const InventoryItem = require('../models/InventoryItem');
const UseHistory = require('../models/UseHistory');

console.log('🔄 useController încărcat.');

// POST /api/use
// Body: { name?: string, items: [{ _id?: string, name: string, quantity: number }] }
exports.createUse = async (req, res) => {
    try {
        const { name, items: usedItems } = req.body;
        console.log(`📝 [${new Date().toISOString()}] createUse: `, { name, usedItems });

        if (!Array.isArray(usedItems) || usedItems.length === 0) {
            return res.status(400).json({ error: 'Trebuie să specifici cel puțin un item.' });
        }

        // Pentru fiecare usedItem, scădem din Inventory dacă _id există
        const historyItems = [];

        for (const ui of usedItems) {
            const { _id, name: itemName, quantity: qty } = ui;
            if (!itemName || qty == null || qty <= 0) {
                return res.status(400).json({ error: 'Fiecare item trebuie să aibă nume și cantitate > 0.' });
            }

            let invRef = null;
            if (_id) {
                const inv = await InventoryItem.findById(_id);
                if (inv) {
                    invRef = inv._id;
                    inv.quantity = Math.max(0, inv.quantity - qty);
                    await inv.save();
                } else {
                    // dacă un _id nu există, ignorăm scăderea
                    console.warn(`⚠️ InventoryItem cu ID=${_id} nu există.`);
                }
            }
            historyItems.push({ inventoryItem: invRef, name: itemName, quantity: qty });
        }

        // Creăm istoria
        const newHistory = await UseHistory.create({
            name: name && name.trim() !== '' ? name.trim() : undefined,
            items: historyItems
        });

        console.log(`✅ UseHistory creat cu ID=${newHistory._id}`);
        res.status(201).json(newHistory);
    } catch (err) {
        console.error('❌ Eroare la createUse:', err);
        res.status(500).json({ error: 'Server error la utilizare.' });
    }
};

// GET /api/use
exports.getAllUseHistory = async (req, res) => {
    try {
        console.log(`📦 [${new Date().toISOString()}] getAllUseHistory`);
        const histories = await UseHistory.find().sort({ date: -1 });
        res.json(histories);
    } catch (err) {
        console.error('❌ Eroare la getAllUseHistory:', err);
        res.status(500).json({ error: 'Server error la get use history.' });
    }
};
