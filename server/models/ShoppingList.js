// server/models/ShoppingList.js
const mongoose = require('mongoose');

const listItemSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    quantity: { type: Number, required: true, default: 1 }
});

const shoppingListSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true, unique: true },
    items: [listItemSchema],
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('ShoppingList', shoppingListSchema);
