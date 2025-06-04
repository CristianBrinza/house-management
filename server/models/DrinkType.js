// server/models/DrinkType.js
const mongoose = require('mongoose');

const drinkTypeSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true, trim: true }
});

module.exports = mongoose.model('DrinkType', drinkTypeSchema);
