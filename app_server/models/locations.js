const goo = require('mongoose');

const openingTimeSchema = new goo.Schema({
    days: { type: String, required: true },
    opening: String, 
    closing: String,
    closed: { type: Boolean, required: true }
});

const reviewSchema = new goo.Schema({
    author: String,
    rating: { type: Number, required: true, min: 0, max: 5 },
    reviewText: String,
    createdOn: { type: Date, 'default': Date.now }
});

const locationSchema = new goo.Schema({
    name: { type: String, required: true },
    address: String,
    rating: { type: Number, 'default': 0, min: 0, max: 5 },
    facilities: [String],
    coords: { type: { type: String }, coordinates: [Number] },
    openingTimes: [openingTimeSchema],
    reviews: [reviewSchema]
});
locationSchema.index({ coords: '2dsphere' });