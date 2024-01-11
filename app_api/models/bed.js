const goo = require('mongoose');

const bedSchema = new goo.Schema({
    begin: { type: Date, required: true },
    end: { type: Date, required: true }
});

goo.model('Bed',bedSchema);