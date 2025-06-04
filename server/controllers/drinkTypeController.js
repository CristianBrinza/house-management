// server/controllers/drinkTypeController.js
const DrinkType = require('../models/DrinkType');

console.log('🔄 drinkTypeController încărcat.');

exports.getAllTypes = async (req, res) => {
    try {
        console.log(`📦 [${new Date().toISOString()}] getAll DrinkTypes`);
        const types = await DrinkType.find().sort({ name: 1 });
        res.json(types);
    } catch (err) {
        console.error('❌ Eroare la getAllTypes:', err);
        res.status(500).json({ error: 'Server error la obținere tipuri.' });
    }
};

exports.createType = async (req, res) => {
    try {
        const { name } = req.body;
        if (!name || name.trim() === '') {
            return res.status(400).json({ error: 'Name este obligatoriu.' });
        }
        const existing = await DrinkType.findOne({ name: name.trim() });
        if (existing) {
            return res.status(400).json({ error: 'Există deja un tip cu acest nume.' });
        }
        const newType = await DrinkType.create({ name: name.trim() });
        console.log(`✅ DrinkType creat: ${newType.name}`);
        res.status(201).json(newType);
    } catch (err) {
        console.error('❌ Eroare la createType:', err);
        res.status(500).json({ error: 'Server error la creare tip.' });
    }
};

exports.updateType = async (req, res) => {
    try {
        const { id } = req.params;
        const { name } = req.body;
        const type = await DrinkType.findById(id);
        if (!type) {
            return res.status(404).json({ error: 'Tip nu a fost găsit.' });
        }
        if (name && name.trim() !== '') {
            // verificăm duplicat
            const conflict = await DrinkType.findOne({ name: name.trim(), _id: { $ne: id } });
            if (conflict) {
                return res.status(400).json({ error: 'Există deja un alt tip cu acest nume.' });
            }
            type.name = name.trim();
        }
        await type.save();
        console.log(`✏️  DrinkType actualizat: ${type.name}`);
        res.json(type);
    } catch (err) {
        console.error('❌ Eroare la updateType:', err);
        res.status(500).json({ error: 'Server error la actualizare tip.' });
    }
};

exports.deleteType = async (req, res) => {
    try {
        const { id } = req.params;
        console.log(`🗑️  [${new Date().toISOString()}] deleteType ID=${id}`);
        const del = await DrinkType.findByIdAndDelete(id);
        if (!del) {
            return res.status(404).json({ error: 'Tip nu a fost găsit.' });
        }
        res.json({ message: 'Tip șters.' });
    } catch (err) {
        console.error('❌ Eroare la deleteType:', err);
        res.status(500).json({ error: 'Server error la ștergere tip.' });
    }
};
