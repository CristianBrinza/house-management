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

        const { name, type, date, price, comment } = req.body;

        // Validări
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
        // `comment` este opțional, dar dacă există trebuie să fie string
        if (comment !== undefined && typeof comment !== 'string') {
            return res.status(400).json({ error: 'Câmpul `comment` trebuie să fie un string.' });
        }

        // Verificăm dacă tipul există în colecția de tipuri
        const typeExists = await DrinkType.findOne({ name: type.trim() });
        if (!typeExists) {
            return res.status(400).json({ error: `Tipul "${type}" nu există. Creează-l în /api/drink-types.` });
        }

        const newDrink = await Drink.create({
            name:    name.trim(),
            type:    type.trim(),
            date:    date,
            price:   price,
            comment: comment ? comment.trim() : ''   // salvează comentariul (sau gol)
        });

        console.log(`✅ Drink creat: ${newDrink._id} → ${newDrink.name}`);
        return res.status(201).json(newDrink);

    } catch (err) {
        console.error('❌ Eroare la createDrink:', err);
        if (err.code === 11000) {
            return res.status(400).json({ error: 'Băutura există deja cu aceleași date unice.' });
        }
        return res.status(500).json({ error: 'Server error la creare băutură.' });
    }
};

exports.updateDrink = async (req, res) => {
    try {
        const { id } = req.params;
        console.log(`🔄 [${new Date().toISOString()}] updateDrink ID=${id} body=%o`, req.body);

        const { name, type, date, price, comment } = req.body;
        const drink = await Drink.findById(id);
        if (!drink) {
            return res.status(404).json({ error: 'Băutura nu a fost găsită.' });
        }

        // Actualizăm doar câmpurile care vin valide în body
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
        if (comment !== undefined) {
            if (typeof comment !== 'string') {
                return res.status(400).json({ error: 'Câmpul `comment` trebuie să fie un string.' });
            }
            drink.comment = comment.trim();
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
