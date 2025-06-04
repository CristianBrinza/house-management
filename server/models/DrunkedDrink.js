// server/models/DrunkedDrink.js
const mongoose = require('mongoose');

const drunkedDrinkSchema = new mongoose.Schema({
    name:       { type: String, required: true, trim: true },
    type:       { type: String, required: true, trim: true },
    date:       { type: String, required: true, trim: true }, // format "YYYY-MM"
    price:      { type: Number, required: true, min: 0 },
    consumedAt: { type: Date,   default: Date.now },
    comment:    { type: String, default: '' }
}, {
    timestamps: false
});

module.exports = mongoose.model('DrunkedDrink', drunkedDrinkSchema);
