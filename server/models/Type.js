// server/models/Type.js
const mongoose = require('mongoose');

const typeSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true, trim: true },
    sub_types: [{ type: String, required: true, trim: true }]
});

module.exports = mongoose.model('Type', typeSchema);
