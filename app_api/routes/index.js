const express = require('express');
const router = express.Router();
const ctrlFortnights = require('../controllers/fortnight');
const ctrlActivities = require('../controllers/activity');
const ctrlLocations = require('../controllers/locations');
const ctrlReviews = require('../controllers/reviews');

// Fortnights
router.route('/years')
    .get(ctrlFortnights.yearsList);
router.route('/years/:year/')
    .get(ctrlFortnights.fortnightsListByOrder)
    .post(ctrlFortnights.yearfortnightsCreate);
router.route('/years/:year/:fortnight')
    .get(ctrlFortnights.fortnightsReadOne)
    .put(ctrlFortnights.fortnightsUpdateOne);
    // .delete(ctrlFortnights.fortnightsDeleteOne);  //  requires fortnights_view_order
router.route('/years/:year/:fortnight/intent')
    .get()  //  get intents
    .post(ctrlActivities.intentActivitiesCreate)  //  requested from more than 1 place?
    .put(ctrlActivities.intentActivitiesUpdate)  //  overwrite delete is separate from specified delete.
    .delete(ctrlActivities.intentActivitiesDelete);  //  long term => "After 14 days, this intent will be deleted as it was not adhered. You can opt to grey the intent to keep it." Any intents that are not adhered should be deleted
router.route('/years/:year/:fortnight/adhered')
    .get()  //  get adhereds
    .post(ctrlActivities.adheredActivitiesCreate)  //  requested from more than 1 place?
    .put()  //  overwrite delete is separate from specified delete.
    .delete();  //  long term => "After 14 days, this intent will be deleted as it was not adhered. You can opt to grey the intent to keep it." Any intents that are not adhered should be deleted


//locations
router.route('/locations')
    .get(ctrlLocations.locationsListByDistance)
    // .post(ctrlLocations.locationsCreate);  //  create New Location
router.route('/locations/:locationid')
    .get(ctrlLocations.locationsReadOne)
    .put(ctrlLocations.locationsUpdateOne)
    .delete(ctrlLocations.locationsDeleteOne);
//reviews
router.route('/locations/:locationid/reviews')
    .post(ctrlReviews.reviewsCreate)  //  create New Review
router.route('/locations/:locationid/reviews/:reviewid')
    .get(ctrlReviews.reviewsReadOne)
    .put(ctrlReviews.reviewsUpdateOne)
    .delete(ctrlReviews.reviewsDeleteOne)

module.exports = router;