// server/models/InventoryItem.js
const mongoose = require('mongoose');

const inventorySchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    quantity: { type: Number, required: true, default: 0 },
    type: { type: String, required: true, trim: true },       // ex: "Food"
    sub_type: { type: String, required: true, trim: true },   // ex: "Vegetable"
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('InventoryItem', inventorySchema);
