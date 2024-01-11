const goo = require('mongoose');
const Loc = goo.model('Location');

const locationsListByDistance = async(req, res) => {
    const lng = parseFloat(req.query.lng);
    const lat = parseFloat(req.query.lat);
    if((!lng && lng !== 0) || (!lat && lat !== 0)) return res.status(404).json({msg: 'both lng and lat are required for a valid location query'});
    console.log("lng and lat: ",lng, lat);
    const near = { type: "Point",  coordinates: [lng,lat] };
    const geoOptions = {
        distanceField: 'distance.calculated',
        spherical: true, maxDistance: 20000,
        // limit: 10  => requires new syntax for page counting
    }
    try{
        const results = await Loc.aggregate([ 
            { $geoNear: { near, ...geoOptions } }
        ]);
        console.log('api_controllers results:');
        const locations = results.map( result => {
            return {
                _id: result._id,
                name: result.name,
                address: result.address,
                rating: result.rating,
                facilities: result.facilities,
                distance: result.distance.calculated.toFixed()
                // distance: `${result.distance.calculated.toFixed()}m`
            }
        });
        res.status(200).json(locations);
    } catch(err) {return res.status(400).json({log: err})}
};

const locationsCreate = (req, res) => {
    Loc.create({
        name: req.body.name, address: req.body.address,
        facililties: req.body.facilities.split(','), 
        openingTimes: [{
            days: req.body.days, opening: req.body.opening,
            closing: req.body.closing, closed: req.body.closed
        }]
    }, (err, location) => {
        if(!location){ return res.status(400).json(err); }
        res.status(201).json({"status":"successfully created new location", location})
    });
};
const locationsReadOne = (req, res) => {
    Loc.findById(req.params.locationid).then( (location) => { 
            if(!location){ return res.status(404).json({ "atext_ptext_eltext": "there is no location with this id, create new location?" }); }
            res.status(200).json(location); 
        } ).catch( (err) => { console.log(err); 
            res.status(400).json({ "console.log" : err, "additionally to any error" : "the ID may be invalid"});
        } );
};

const locationsUpdateOne = (req, res) => {
    if(!req.params.locationid) return res.status(404).json({ "msg": "Not found, locationid is required" });

    Loc.findById(req.params.locationid).select('-reviews -rating')  //  -reviews -rating "-" symbol selects all properties other than reviews and ratings
        .exec((err, location) => {
            if(!location) return res.status(404).json({ "msg": "locationid not found" });
            if(err) return res.status(400).json(err);

            location.name = req.body.name;  location.address = req.body.address;
            location.facilities = req.body.facilities.split(',');
            location.coords = [ parseFloat(req.body.lng), parseFloat(req.body.lat) ];
            location.openingTimes = [{
                    days: req.body.days1,  opening: req.body.opening1,
                    closing: req.body.closing1, closed: req.body.closed1,
                }, {
                    days: req.body.days2,  opening: req.body.opening2,
                    closing: req.body.closing2,  closed: req.body.closed2,
                }
            ];
            
            location.save((err, loc) => {
                if(err) return res.status(404).json(err);
                res.status(200).json(loc);
            });
        });
};

const locationsDeleteOne = (req, res) => {
    const { locationid } = req.params;
    if (!locationid) res.status(404).json({"msg": "No Location"});
  
    Loc.findByIdAndRemove(locationid)
        .exec((err, location) => {
            if(err) return res.status(404).json(err);
            res.status(204).json(null);
        });
};

module.exports = {
    locationsListByDistance,
    locationsCreate,
    locationsReadOne,
    locationsUpdateOne,
    locationsDeleteOne
}