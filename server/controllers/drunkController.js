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

        // Creăm un document în DrunkedDrink
        const newDrunked = await DrunkedDrink.create({
            name:       drink.name,
            type:       drink.type,
            date:       drink.date,
            price:      drink.price,
            consumedAt: new Date(),
            comment:    drink.comment || ''
        });

        // Ștergem băutura originală din colecţia Drink
        await Drink.findByIdAndDelete(id);

        console.log(`✅ Drink “${drink.name}” a fost mutat la DrunkedDrink cu ID ${newDrunked._id}`);
        return res.json({
            message: 'Băutura a fost marcată ca „drunked” și mutată în colecție.',
            drunked: newDrunked
        });
    } catch (err) {
        console.error('❌ Eroare la consumeDrink:', err);
        return res.status(500).json({ error: 'Server error la consumare băutură.' });
    }
};

exports.updateDrunkedComment = async (req, res) => {
    try {
        const { id }      = req.params;
        const { comment } = req.body;

        console.log(`✏️ [${new Date().toISOString()}] updateDrunkedComment ID=${id} comment=%s`, comment);

        if (typeof comment !== 'string') {
            return res.status(400).json({ error: 'Câmpul `comment` trebuie să fie string.' });
        }

        const drunked = await DrunkedDrink.findById(id);
        if (!drunked) {
            return res.status(404).json({ error: 'Băutura consumată nu a fost găsită.' });
        }

        drunked.comment = comment.trim();
        await drunked.save();

        console.log(`✅ Comentariu actualizat pentru DrunkedDrink ID=${id}`);
        return res.json(drunked);
    } catch (err) {
        console.error('❌ Eroare la updateDrunkedComment:', err);
        return res.status(500).json({ error: 'Server error la actualizare comentariu băutură consumată.' });
    }
};
