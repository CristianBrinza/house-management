// server/controllers/typeController.js
const Type = require('../models/Type');
const InventoryItem = require('../models/InventoryItem');

console.log('🔄 typeController încărcat.');

// 1. GET /api/types – listează toate tipurile cu subtipuri
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

// 2. POST /api/types – creează un tip nou
// Body: { name: string }
exports.createType = async (req, res) => {
    try {
        const { name } = req.body;
        console.log(`🆕 [${new Date().toISOString()}] createType:`, { name });
        if (!name || name.trim() === '') {
            return res.status(400).json({ error: 'Name este obligatoriu.' });
        }
        const existing = await Type.findOne({ name: name.trim() });
        if (existing) {
            return res.status(400).json({ error: 'Există deja un tip cu acest nume.' });
        }
        const newType = await Type.create({ name: name.trim(), sub_types: [] });
        console.log(`✅ Type creat cu ID=${newType._id}`);
        res.status(201).json(newType);
    } catch (err) {
        console.error('❌ Eroare la createType:', err);
        res.status(500).json({ error: 'Server error creating type' });
    }
};

// 3. PUT /api/types/:id – actualizează numele unui tip
// Body: { name: string }
exports.updateType = async (req, res) => {
    try {
        const { id } = req.params;
        const { name: newName } = req.body;

        console.log(`✏️ [${new Date().toISOString()}] updateType ID=${id}, newName=${newName}`);

        if (!newName || newName.trim() === '') {
            return res.status(400).json({ error: 'Name este obligatoriu.' });
        }

        const typeDoc = await Type.findById(id);
        if (!typeDoc) {
            return res.status(404).json({ error: 'Tipul nu a fost găsit.' });
        }

        const oldName = typeDoc.name;
        if (oldName === newName.trim()) {
            return res.status(200).json(typeDoc);
        }

        // Verifică dacă există deja un alt tip cu noul nume
        const conflict = await Type.findOne({ name: newName.trim(), _id: { $ne: id } });
        if (conflict) {
            return res.status(400).json({ error: 'Există deja un alt tip cu acest nume.' });
        }

        // Actualizare InventoryItem: înlocuiește oldName cu newName
        await InventoryItem.updateMany(
            { type: oldName },
            { type: newName.trim() }
        );
        console.log(`🔄 Inventory items tip schimbat de la "${oldName}" la "${newName.trim()}"`);

        // Salvează noul nume în document
        typeDoc.name = newName.trim();
        const updatedType = await typeDoc.save();
        console.log(`✅ Type ID=${id} actualizat: ${oldName} → ${updatedType.name}`);
        res.json(updatedType);
    } catch (err) {
        console.error('❌ Eroare la updateType:', err);
        res.status(500).json({ error: 'Server error updating type' });
    }
};

// 4. DELETE /api/types/:id – șterge un tip
exports.deleteType = async (req, res) => {
    try {
        const { id } = req.params;
        console.log(`🗑️ [${new Date().toISOString()}] deleteType ID=${id}`);

        const typeDoc = await Type.findById(id);
        if (!typeDoc) {
            return res.status(404).json({ error: 'Tipul nu a fost găsit.' });
        }

        const oldName = typeDoc.name;

        // Setează type și sub_type la empty string pentru toate itemii care foloseau acest tip
        await InventoryItem.updateMany(
            { type: oldName },
            { type: '', sub_type: '' }
        );
        console.log(`🔄 Inventory items cu type="${oldName}" au fost resetate la type="" și sub_type=""`);

        await Type.findByIdAndDelete(id);
        res.json({ message: 'Tip șters.' });
    } catch (err) {
        console.error('❌ Eroare la deleteType:', err);
        res.status(500).json({ error: 'Server error deleting type' });
    }
};

// 5. POST /api/types/:id/subtypes – adaugă un subtip
// Body: { name: string }
exports.addSubType = async (req, res) => {
    try {
        const { id } = req.params;
        const { name: subName } = req.body;
        console.log(`➕ [${new Date().toISOString()}] addSubType la Type ID=${id}: ${subName}`);

        if (!subName || subName.trim() === '') {
            return res.status(400).json({ error: 'Name este obligatoriu.' });
        }
        const typeDoc = await Type.findById(id);
        if (!typeDoc) {
            return res.status(404).json({ error: 'Tipul nu a fost găsit.' });
        }

        if (typeDoc.sub_types.includes(subName.trim())) {
            return res.status(400).json({ error: 'Există deja acest subtip.' });
        }

        typeDoc.sub_types.push(subName.trim());
        const updatedType = await typeDoc.save();
        console.log(`✅ Subtip "${subName.trim()}" adăugat la Type "${typeDoc.name}"`);
        res.json(updatedType);
    } catch (err) {
        console.error('❌ Eroare la addSubType:', err);
        res.status(500).json({ error: 'Server error adding sub-type' });
    }
};

// 6. PUT /api/types/:id/subtypes – schimbă numele unui subtip
// Body: { oldName: string, newName: string }
exports.renameSubType = async (req, res) => {
    try {
        const { id } = req.params;
        const { oldName, newName } = req.body;
        console.log(`✏️ [${new Date().toISOString()}] renameSubType la Type ID=${id}: ${oldName} → ${newName}`);

        if (!oldName || !newName || newName.trim() === '') {
            return res.status(400).json({ error: 'Both oldName and newName sunt obligatorii.' });
        }
        const typeDoc = await Type.findById(id);
        if (!typeDoc) {
            return res.status(404).json({ error: 'Tipul nu a fost găsit.' });
        }

        const idx = typeDoc.sub_types.indexOf(oldName);
        if (idx === -1) {
            return res.status(400).json({ error: 'Subtipul vechi nu există.' });
        }
        if (typeDoc.sub_types.includes(newName.trim())) {
            return res.status(400).json({ error: 'Există deja un subtip cu acest nou nume.' });
        }

        // Înlocuiește în array-ul sub_types
        typeDoc.sub_types[idx] = newName.trim();
        await typeDoc.save();

        // Cascade update: schimbă toate itemele din Inventory care au acel sub_type și același type
        await InventoryItem.updateMany(
            { type: typeDoc.name, sub_type: oldName },
            { sub_type: newName.trim() }
        );
        console.log(`🔄 Inventory items sub_type schimbat de la "${oldName}" la "${newName.trim()}" pentru type="${typeDoc.name}"`);

        res.json(typeDoc);
    } catch (err) {
        console.error('❌ Eroare la renameSubType:', err);
        res.status(500).json({ error: 'Server error renaming sub-type' });
    }
};

// 7. DELETE /api/types/:id/subtypes – șterge un subtip
// Body: { name: string }
exports.deleteSubType = async (req, res) => {
    try {
        const { id } = req.params;
        const { name: subName } = req.body;
        console.log(`🗑️ [${new Date().toISOString()}] deleteSubType la Type ID=${id}: ${subName}`);

        if (!subName || subName.trim() === '') {
            return res.status(400).json({ error: 'Name este obligatoriu.' });
        }
        const typeDoc = await Type.findById(id);
        if (!typeDoc) {
            return res.status(404).json({ error: 'Tipul nu a fost găsit.' });
        }

        if (!typeDoc.sub_types.includes(subName.trim())) {
            return res.status(400).json({ error: 'Subtipul nu există.' });
        }

        // Elimină din array
        typeDoc.sub_types = typeDoc.sub_types.filter((st) => st !== subName.trim());
        await typeDoc.save();

        // Cascade update: toate itemele din Inventory care aveau acest sub_type și acel type → sub_type=''
        await InventoryItem.updateMany(
            { type: typeDoc.name, sub_type: subName.trim() },
            { sub_type: '' }
        );
        console.log(`🔄 Inventory items cu sub_type="${subName.trim()}" setat la "" pentru type="${typeDoc.name}"`);

        res.json(typeDoc);
    } catch (err) {
        console.error('❌ Eroare la deleteSubType:', err);
        res.status(500).json({ error: 'Server error deleting sub-type' });
    }
};
