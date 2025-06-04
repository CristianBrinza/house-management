// server/models/UseHistory.js
const mongoose = require('mongoose');

const useItemSchema = new mongoose.Schema({
    inventoryItem: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'InventoryItem',
        required: false
    },
    name: { type: String, required: true, trim: true },
    quantity: { type: Number, required: true }
});

const useHistorySchema = new mongoose.Schema({
    name: { type: String, trim: true },
    date: { type: Date, default: Date.now },
    items: [useItemSchema]
});

module.exports = mongoose.model('UseHistory', useHistorySchema);
