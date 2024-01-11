const express = require('express');
const router = express.Router();
const ctrlLocations = require('../controllers/locations');
const ctrlCal = require('../controllers/cal');
const ctrlOthers = require('../controllers/others');

//  Loc8r
router.get('/', ctrlLocations.homelist);
router.get('/location/:locationid', ctrlLocations.locationInfo);
router.route('/location/:locationid/review/new')
    .get(ctrlLocations.addReview)
    .post(ctrlLocations.doAddReview);

//  calmon
router.get('/years', ctrlCal.decadeList);
router.get('/years/:year', ctrlCal.fortnightList);
router.get('/years/:year/:fortnight', ctrlCal.cal);
router.get('/years/:year/:fortnight/draft-schedule', ctrlCal.draftSch);
router.get('/years/:year/:fortnight/activity-form', ctrlCal.activityForm);

router.get('/about', ctrlOthers.about);

module.exports = router;
