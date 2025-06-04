// server/controllers/drunkController.js
const DrunkedDrink = require('../models/DrunkedDrink');
const Drink        = require('../models/Drink');

console.log('🔄 drunkController încărcat.');

exports.getDrunkedDrinks = async (req, res) => {
    try {
        console.log(`📦 [${new Date().toISOString()}] getDrunkedDrinks`);
        const items = await DrunkedDrink.find().sort({ consumedAt: -1 });
        return res.json(items);
    } catch (err) {
        console.error('❌ Eroare la getDrunkedDrinks:', err);
        return res.status(500).json({ error: 'Server error la obținere băuturi consumate.' });
    }
};

exports.consumeDrink = async (req, res) => {
    try {
        const { id } = req.params;
        console.log(`🛒 [${new Date().toISOString()}] consumeDrink ID=${id}`);

        const drink = await Drink.findById(id);
        if (!drink) {
            return res.status(404).json({ error: 'Băutura nu a fost găsită.' });
        }

        // Creăm un document în DrunkedDrink fără sub_type:
        const newDrunked = await DrunkedDrink.create({
            name:       drink.name,
            type:       drink.type,
            date:       drink.date,
            price:      drink.price,
            consumedAt: new Date()
        });

        // Ștergem băutura originală din colecţia Drink:
        await Drink.findByIdAndDelete(id);

        console.log(`✅ Drink “${drink.name}” a fost mutat la DrunkedDrink cu ID ${newDrunked._id}`);
        return res.json({
            message:   'Băutura a fost marcată ca „drunked” şi mutată în colecţie.',
            drunked:   newDrunked
        });
    } catch (err) {
        console.error('❌ Eroare la consumeDrink:', err);
        return res.status(500).json({ error: 'Server error la consumare băutură.' });
    }
};
