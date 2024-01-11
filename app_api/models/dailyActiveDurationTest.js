const mongoose = require('mongoose');
console.log('app.js has required dailyActiveDurationTest');

const activeDurationDurationSchema = new mongoose.Schema({
    begin: Date, end: Date
});
const activeDurationSchema = new mongoose.Schema({
    activityCode: String,
    duration: activeDurationDurationSchema
});
const dailyActiveDurationSchema = new mongoose.Schema({
    dayOrdinal: Number,
    activities: [activeDurationSchema]
});
mongoose.model('TestDailyActiveDuration',dailyActiveDurationSchema);

console.log('dailyActiveDurationTest testing');

const TDad = mongoose.model('TestDailyActiveDuration');
let sixAM=21600000; let eightAM=28800000
let midday=43200000; 
let militaryTimes = []; let midnight=0
for(let h=0;h<24;h++){
    militaryTimes.push(midnight+=3600000);
}
console.log(militaryTimes);
let today = new Date();
let tomorrow = new Date(today.getFullYear(),today.getMonth(),today.getDate()+1);
console.log("tomorrow:",tomorrow);
function readTDad(){
    TDad.find()
        .then(tdads => console.log("TDADS.READ:",JSON.stringify(tdads,null,2)))
        .catch(ce => console.log('TDAD.READ CATCH err:', ce))
}
function createTDad(){
    TDad.create({
        dayOrdinal:0,
        activities:[
{
    activityCode: "10000 (No Activity)",
    duration: {
        begin: new Date(tomorrow.getTime()+militaryTimes[6]),
        end: new Date(tomorrow.getTime()+militaryTimes[8])
    }
},
{
    activityCode: "10000 (No Activity)",
    duration: {
        begin: new Date(tomorrow.getTime()+militaryTimes[9]),
        end: new Date(tomorrow.getTime()+militaryTimes[11])
    }        
}
        ]
    }).then((test) => {
        if(!test) return console.log('TAD.CREATE bad request');
        console.log('TDAD.CREATE created:',test);
        readTDad();
    }).catch(ce => console.log('TDAD.CREATE CATCH err:', ce));
}
function updateTDad(){
    TDad.findOneAndUpdate(
        {duration: {_id:'653a56d94f3e5b66aa867900'}},
        {duration:{end:new Date(tomorrow.getTime()+midday)}}
        ).then(ur => console.log('TDADS.UPDATE:',ur))
        .catch(ce => console.log('TDAD.UPDATE CATCH:',ce))
}
function deleteTDad(idarg){
    TDad.findByIdAndDelete(
        {_id:idarg}
        ).then(dr => {
            console.log('TDADS.DELETE:',dr);
            readTDad();
        }).catch(ce => console.log('TDAD.DELETE CATCH:',ce))
}

// createTDad();
// updateTDad();
readTDad();
deleteTDad('653a9191f3aef555fdc050fc');
console.log('DailyActiveDurationTest testing closing');

