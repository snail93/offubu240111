const goo = require('mongoose');

const timeOfDayBoundsSchema = new goo.Schema({
    earlyAMBegin: Number, earlyAMEnd: Number,
    morningBegin: Number, morningEnd: Number,
    afternoonBegin: Number, afternoonEnd: Number,
    eveningBegin: Number, eveningEnd: Number
});
const durationSchema = new goo.Schema({
    begin: { type: Date, required: true },
    end: { type: Date, required: true }
});
const activitySchema = new goo.Schema({
    activityName: { type: String, required: true },
    activityCode: { type: String, required: true }, 
    duration: { type: durationSchema, required: true }
});
const daySchema = new goo.Schema({
    dayOrdinal: { type: Number, required: true },
    date: { type: Date, required: true },
    intentPhysicalActivities: [{ type: activitySchema, required: true }],
    intentGroupActivities: [{ type: activitySchema, required: true }],
    expectedRoutineActivities: [{ type: activitySchema, required: true }]
});

const awakeSchema = new goo.Schema({
    begin: { type: Number, required: true }, end: { type: Number, required: true }
});

const modeSchema = new goo.Schema({ mode_name: String, mode: Number });

const measureSchema = new goo.Schema({ unit: String, measure: Number });
const nutritionSchema = new goo.Schema({ 
    name: String, measureList: [measureSchema]
});

const labelSchema = new goo.Schema({ 
    extractedText: { type: String, required: true } , 
    labelName: { type: String, required: true }
});
const commentSchema = new goo.Schema({
    author: { type: String, required: true }, 
    timestamp: { type: Date, required: true },
    commentText: { type: String, required: true },
    labels: [labelSchema]
} );


const fortnightSchema = new goo.Schema({
    ordinalNumber: { type: Number, required: true },
    day1Fzero: { type: Date, required: true },
    wakingDuration: { type: awakeSchema, required: true },
    days: [{ type: daySchema, required: true }],
    modes: [modeSchema],
    nutritionHistory: [nutritionSchema],
    comments: [commentSchema]
});

const yearSchema = new goo.Schema({
    year: { type: Number, required: true },
    fortnights: [{ type: fortnightSchema, required: true }]
});

goo.model('Year',yearSchema);