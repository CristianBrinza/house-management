// server/controllers/typeController.js
const Type = require('../models/Type');

console.log('🔄 typeController încărcat.');

// Obține toate tipurile cu subtips-uri
exports.getAllTypes = async (req, res) => {
    try {
        console.log(`📦 [${new Date().toISOString()}] GET /api/types`);
        const types = await Type.find().sort({ name: 1 });
        res.json(types);
    } catch (err) {
        console.error('❌ Eroare la getAllTypes:', err);
        res.status(500).json({ error: 'Server error fetching types' });
    }
};

// (Optional) Poți adăuga și endpoint-uri CRUD pentru tipuri:
// exports.createType = async (req, res) => { … }
// exports.updateType = async (req, res) => { … }
// exports.deleteType = async (req, res) => { … }
