const goo = require('mongoose');
const Loc = goo.model('Location');

const doSetAverageRating = (res, location) => { console.log(`doing rating update`);
    if (location.reviews && location.reviews.length > 0) {
        const count = location.reviews.length;
        const total = location.reviews.reduce((acc, {rating}) => {
            return acc + rating;
        }, 0);
  
        location.rating = parseInt(total / count, 10);
        console.log('ratingUpdate Pending:', JSON.stringify(location));
        location.save();
        console.log(`Average rating updated to ${location.rating}`);
    }
    res.redirect(`/location/${location._id}`);
};

const updateAverageRating = (res, locationId) => { console.log(`rating update for ${locationId}`);
    Loc.findById(locationId).select('rating reviews')
        .then( location => { 
            console.log('found for updateAverageRating pending'); 
            if(location) doSetAverageRating(res, location); 
        }).catch(ce => console.log(ce))
};

const doAddReview = (req, res, location) => { if (!location) return res.status(404).json({"message": "Location not found"});

    const postData={
        author: req.body.name,
        rating: parseInt(req.body.rating,10),
        timestamp: new Date(),
        reviewText: req.body.review
    }  //  const {author, rating, reviewText} = req.body;

    console.log('prePush:', JSON.stringify(location));
    location.reviews.push(postData);  location.save();
    console.log('pushSave:',JSON.stringify(location));
    updateAverageRating(res, location._id); console.log('updatedRating:',JSON.stringify(location));
    return res.status(201).json(location.reviews.slice(-1).pop());
    // res.redirect(`/location/${location._id}`);
    // location.save((err, location) => { 
    //     if(err) return res.status(400).json(err); 
    //     const thisReview = location.reviews.slice(-1).pop();
    //     return res.status(201).json(thisReview);
    // });
};

const reviewsCreate = (req,res) => {
    Loc.find({name:'DemoPath'})
        .then(loc => { console.log('find dchecker:',loc)
            let dcheck = new Date(2016,2,12); let dcheck1 = new Date(2016,2,13)
            
            console.log('dcheck plain:',dcheck,'keying issue:',loc[0].reviews[0].timestamp)
            for(let l=0;l<loc[0].reviews.length;l++){
                console.log(loc[0].reviews[l],dcheck);
                if(dcheck.toString()==loc[0].reviews[l].timestamp.toString()) console.log('DCHECK +VE')
                if(dcheck1.toString()==loc[0].reviews[l].timestamp.toString()) console.log('DCHECK1 +VE')
            }
        })
    const locationid = req.params.locationid;
    if(!locationid) return res.status(404).json({"id issue": "id not valid"});
    Loc.findById(locationid).select('reviews rating')  //
        .then( location => {
            if(!location) return res.status(404).json({msg: 'location not found'});
            return doAddReview(req, res, location);
        });
};

const reviewsReadOne = (req,res) => {
    Loc.findById(req.params.locationid)
        .then( (location) => {
            if(!location){ return res.status(400).json({"location_missing": "potentially valid id, you cannot review a location that doesnt exist"}) }
            
            const review = location.reviews.id(req.params.reviewid);
            if(!review){ return res.status(400).json({"bad_request" : "reviewid not found, or reviewid format is invalid"}); }
            
            const response = {
                location: {
                    name: location.name,
                    id: req.params.locationid
                },
                review
            }
            return res.status(200).json(response);
        }).catch( (err) => { console.log(err);
            res.status(400).json({"error_log" : err, "description": "the ID format may be invalid, or something else"});
        });
};

const reviewsUpdateOne = (req,res) => {
    if (!req.params.locationid || !req.params.reviewid) {
        return res.status(404).json({ "msg": "Not found, locationid and reviewid are both required" });
    }

    Loc.findById(req.params.locationid).select('reviews')
        .exec((err, location) => {
            if(!location) return res.status(404).json({ "msg": "Location not found" });
            if(err) return res.status(400).json(err);
            if(!location.reviews || location.reviews.length<1) return res.status(404).json({ "msg": "No review to update" });

            const thisReview = location.reviews.id(req.params.reviewid);
            if(!thisReview) return res.status(404).json({"msg": "Review not found" });
            
            thisReview.author = req.body.author;
            thisReview.rating = req.body.rating;
            thisReview.reviewText = req.body.reviewText;
            location.save((err, location) => {
                if(err) return res.status(404).json(err);
                updateAverageRating(location._id);
                return res.status(200).json(thisReview);
            });
        });
};
const reviewsDeleteOne = (req,res) => {
    const {locationid, reviewid} = req.params;
    if (!locationid || !reviewid) return res.status(404).json({'message': 'Not found, locationid and reviewid are both required'});
  
    Loc.findById(locationid).select('reviews')
        .then( location => {
            if(!location) return res.status(404).json({'msg': 'Location not found'});
            if(!location.reviews || location.reviews.length < 1) return res.status(404).json({'msg': 'No Review to delete'});
            if(!location.reviews.id(reviewid)) return res.status(404).json({'message': 'Review not found'});
            
            location.reviews.id(reviewid).remove();
                location.save(err => {
                if(err) return res.status(404).json(err);
                updateAverageRating(location._id);
                res.status(204).json(null);
            });
        }).catch(ce => console.log(ce));
};

module.exports = {
    reviewsCreate,
    reviewsReadOne,
    reviewsUpdateOne,
    reviewsDeleteOne
}