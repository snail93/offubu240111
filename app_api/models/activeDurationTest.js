const mongoose = require('mongoose');
console.log('app.js has required activeDurationTest');

const activeDurationDurationSchema = new mongoose.Schema({
    begin: Date, end: Date
});
const activeDurationSchema = new mongoose.Schema({
    activityCode: String,
    duration: [activeDurationDurationSchema]
});
mongoose.model('TestActiveDuration',activeDurationSchema);

console.log('activeDurationTest testing');

const TAD = mongoose.model('TestActiveDuration');
let sixAM=21600000
let eightAM=28800000
let midday=43200000
let today = new Date();
let tomorrow = new Date(today.getFullYear(),today.getMonth(),today.getDate()+1);
console.log("tomorrow:",tomorrow);
function readTad(){
    TAD.find()
        .then(tads => console.log("TADS.READ:",tads))
        .catch(ce => console.log('TAD.READ CATCH err:', ce))
}
const createTad = () => {
    TAD.create({
        activityCode: "10000 (No Activity)",
        duration: {
            begin: new Date(tomorrow.getTime()+20000),
            end: new Date(tomorrow.getTime()+22000)
        }
    }).then((test) => {
        if(!test) return console.log('TAD.CREATE bad request');
        console.log('TAD.CREATE created:',test);
        readTad();
    }).catch(ce => console.log('TAD.CREATE CATCH err:', ce));
}
function updateTad(){
    TAD.findOneAndUpdate(
        {duration: {_id:'653a9931164a9d53bd8059d2'}},
        {duration:{end:new Date(tomorrow.getTime()+10000)}}
        ).then(ur => {
            console.log('TADS.UPDATE:',ur)
            readTad();
        })
        .catch(ce => console.log('TAD.UPDATE CATCH:',ce))
}
function deleteTad(idarg){
    TAD.findByIdAndDelete({_id:idarg})
        .then(dr => {
            console.log('TADS.DELETE:',dr)
            readTad();
        })
        .catch(ce => console.log('TAD.DELETE CATCH:',ce))
}
async function subDeleteTad(idarg,sidarg){
    TAD.findById({_id:idarg})
        .then(f => {
            // f.duration.id(sidarg).deleteOne();
            // f.save();
            // sub.delete().save();
            console.log('TADS.DELETE:',f);
            readTad();
        })
        .catch(ce => console.log('TAD.DELETE CATCH:',ce))
}

// createTad();
// updateTad();
// deleteTad('653b78fcfc57a242fa0e0646');
subDeleteTad(
    '653a61f31c1aa25fe80db1f2',
    '653b78fcfc57a242fa0e0646');
// readTad();
console.log('activeDurationTest testing closing');

