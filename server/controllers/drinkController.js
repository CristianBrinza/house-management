// server/controllers/drinkController.js
const Drink = require('../models/Drink');
const DrinkType = require('../models/DrinkType');

console.log('🔄 drinkController încărcat.');

exports.getDrinks = async (req, res) => {
    try {
        console.log(`📦 [${new Date().toISOString()}] getDrinks → query=%o`, req.query);
        const filter = {};

        if (req.query.name) {
            filter.name = { $regex: req.query.name, $options: 'i' };
        }
        if (req.query.type) {
            filter.type = req.query.type;
        }

        const drinks = await Drink.find(filter).sort({ name: 1 });
        return res.json(drinks);
    } catch (err) {
        console.error('❌ Eroare la getDrinks:', err);
        return res.status(500).json({ error: 'Server error la obținere băuturi.' });
    }
};

exports.createDrink = async (req, res) => {
    try {
        console.log(`📥 [${new Date().toISOString()}] createDrink → body=%o`, req.body);

        const { name, type, date, price } = req.body;

        if (!name || typeof name !== 'string' || name.trim() === '') {
            return res.status(400).json({ error: 'Câmpul `name` este obligatoriu și trebuie să fie un string nevid.' });
        }
        if (!type || typeof type !== 'string' || type.trim() === '') {
            return res.status(400).json({ error: 'Câmpul `type` este obligatoriu și trebuie să fie un string nevid.' });
        }
        if (!date || typeof date !== 'string' || !/^\d{4}-\d{2}$/.test(date)) {
            return res.status(400).json({ error: 'Câmpul `date` este obligatoriu în formatul YYYY-MM.' });
        }
        if (price === undefined || typeof price !== 'number' || price < 0) {
            return res.status(400).json({ error: 'Câmpul `price` este obligatoriu și trebuie să fie un număr ≥ 0.' });
        }

        // Verificăm dacă tipul există
        const typeExists = await DrinkType.findOne({ name: type.trim() });
        if (!typeExists) {
            return res.status(400).json({ error: `Tipul "${type}" nu există. Trebuie întâi să-l creezi în /api/drink-types.` });
        }

        const newDrink = await Drink.create({
            name: name.trim(),
            type: type.trim(),
            date: date,
            price: price
        });
        console.log(`✅ Drink creat: ${newDrink._id} → ${newDrink.name}`);
        return res.status(201).json(newDrink);
    } catch (err) {
        console.error('❌ Eroare la createDrink:', err);
        if (err.code === 11000) {
            return res.status(400).json({ error: 'Băutura există deja în baza de date cu aceleași câmpuri unice.' });
        }
        return res.status(500).json({ error: 'Server error la creare băutură.' });
    }
};

exports.updateDrink = async (req, res) => {
    try {
        const { id } = req.params;
        console.log(`🔄 [${new Date().toISOString()}] updateDrink ID=${id} body=%o`, req.body);

        const { name, type, date, price } = req.body;
        const drink = await Drink.findById(id);
        if (!drink) {
            return res.status(404).json({ error: 'Băutura nu a fost găsită.' });
        }

        if (name && typeof name === 'string' && name.trim() !== '') {
            drink.name = name.trim();
        }
        if (type && typeof type === 'string' && type.trim() !== '') {
            const typeExists = await DrinkType.findOne({ name: type.trim() });
            if (!typeExists) {
                return res.status(400).json({ error: `Tipul "${type}" nu există.` });
            }
            drink.type = type.trim();
        }
        if (date && typeof date === 'string' && /^\d{4}-\d{2}$/.test(date)) {
            drink.date = date;
        }
        if (price !== undefined && typeof price === 'number' && price >= 0) {
            drink.price = price;
        }

        await drink.save();
        console.log(`✏️  Drink actualizat: ${drink._id} → ${drink.name}`);
        return res.json(drink);
    } catch (err) {
        console.error('❌ Eroare la updateDrink:', err);
        return res.status(500).json({ error: 'Server error la actualizare băutură.' });
    }
};

exports.deleteDrink = async (req, res) => {
    try {
        const { id } = req.params;
        console.log(`🗑️  [${new Date().toISOString()}] deleteDrink ID=${id}`);
        const del = await Drink.findByIdAndDelete(id);
        if (!del) {
            return res.status(404).json({ error: 'Băutura nu a fost găsită.' });
        }
        return res.json({ message: 'Băutura a fost ștearsă.' });
    } catch (err) {
        console.error('❌ Eroare la deleteDrink:', err);
        return res.status(500).json({ error: 'Server error la ștergere băutură.' });
    }
};
