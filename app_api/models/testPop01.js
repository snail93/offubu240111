const mongoose = require('mongoose');
console.log('app.js has required Population Testing');


const durationSchema = new mongoose.Schema({
    begin: Date, end: Date
});
const activityDurationSchema = new mongoose.Schema({
    activityCode: String,
    duration: {type: mongoose.ObjectId,ref:}
});
const dayActivityDurationSchema = new mongoose.Schema({

});
const fortDayActivityDurationSchema = new mongoose.Schema({

});
const yearFortDayActivityDurationSchema = new mongoose.Schema({
    
});


mongoose.model();
mongoose.model();
mongoose.model();
mongoose.model();