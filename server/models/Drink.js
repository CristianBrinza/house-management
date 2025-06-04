// server/models/Drink.js
const mongoose = require('mongoose');

const drinkSchema = new mongoose.Schema({
    name:    { type: String, required: true, trim: true },
    type:    { type: String, required: true, trim: true },
    date:    { type: String, required: true, trim: true },
    price:   { type: Number, required: true, min: 0 },
    comment: { type: String, default: '', trim: true }
}, {
    timestamps: true
});

module.exports = mongoose.model('Drink', drinkSchema);
