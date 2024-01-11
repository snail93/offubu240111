const names = ['DownStreet','RouteP','3Leaf']
const commonAddress='125 High Street, Reading, RG6 1PS'
const ratings = [3,4,2]
const facilities=['Hot Drinks','Food','Kills','Wifi']
const _3leafFacs=facilities.slice(0,3)
const otherFacs=facilities.slice(0,2).concat(facilities[3])
const distances=["100m","200m","300m"]

locationsList=[]; 
for(i=0;i<3;i++){
  location={};  location['name']=names[i];
  location['address']=commonAddress;  location['rating']=ratings[i];
  if(names[i]=='3Leaf') location['facilities']=_3leafFacs
  else location['facilities']=otherFacs
  location['distance']=distances[i]
  locationsList.push(location)
}
// console.dir(locationsList)


const renderHomepage = (req, res, bODY) => {
  let message = '';
  console.log('bODY: ', bODY);
  if(!(bODY instanceof Array)){ message='API lookup error'; bODY = []; }
  else { if(!bODY.length) message = 'No places found nearby'; } 

  res.render('locations-list', { 
    title: 'Loc8r - Basis for Calendar with complex anyType' ,
    pageHeader: {
      title: 'Loc8r',
      strapline: 'Workplace requirements for timeslots => cal'
    },
    locations: bODY,  //  locationsList,
    sidebar: "Continue for Cal.js, followed by AnyType -> Test Gradient",
    message
  }); // res.end();
}

// const request = require('request');
const apiOptions = { server: 'http://localhost:3400' };
if(process.env.NODE_ENV === 'production') apiOptions.server = 'https://pure-temple-67771.herokuapp.com';
const { log } = require('console')
const http = require('http');
const formatDistance = (distance) =>{
  let thisDistance = Math.floor(distance); let unit = 'm';
  if(distance > 1000){ unit = 'km';
    thisDistance = parseFloat(distance/1000).toFixed(1);
  }
  return thisDistance + unit;
}
const homelist = (req, res) => {
  console.log('route /locations is calling homelist controller => GET');
  http.get(
    // `${apiOptions.server}/api/locations/?lng=-0.9690884', //&lat=51.445041`,
    `${apiOptions.server}/api/locations/?lng=-0.9690884&lat=51.445041`,
    response => {
      console.log('attempting connection to api/locations/?lng=-0.9690884&lat=51.445041');
      if(response.statusCode == 200) console.log(response.statusCode);
      //  //>>>logRocketScraped
      let data = [];
      const headerDate = response.headers && response.headers.date ? response.headers.date : 'no response date';
      console.log('Status Code:', response.statusCode);
      console.log('Date in Response header:', headerDate);

      response.on('data', chunk => { data.push(chunk); console.log(data); });

      response.on('end', () => { 
        console.log('Response ended, data received: ',data);
        // const users = JSON.parse(Buffer.concat(data).toString());
        data = JSON.parse(Buffer.concat(data).toString());
        // for(user of users) { console.log(`Got user with id: ${user.id}, name: ${user.name}`); }
        // console.log('users:',users);
        console.log('logRocket users => data:',data);

        let body = [];
        if(response.statusCode == 200 && data.length){
          body = data.map( i => { 
            i.distance = formatDistance(i.distance); return i;
          });
        }
        console.log('body being sent to bODY:',body);
        if(body.length) return renderHomepage(req,res,body);
        return renderHomepage(req,res,data);
      });  //  //>>>logRocketScraped
    }
  ).on('error', err => { console.log('Error: ', err.message); });
};
const renderDetailPage = (req,res,locationinfo) => {
  res.render('location-info', { 
    title: 'Downs Syndrome',
    pageHeader: {title: 'Single Location'},
    sidebar: {
      context: 'is on Loc8r because it has accessible wifi and space to sit down with your laptop and get some work done.',
      callToAction: 'If you\'ve been and you like it - or if you don\'t please leave a review to help other people just like you.'
    },
    location: locationinfo
  });
}

const getLocationInfo = (req,res,callback) => {
  http.get(
    `${apiOptions.server}/api/locations/${req.params.locationid}`,
    response => { console.log('attempting connection to api/locations/:locationid');
      let data = [];  const headerDate = response.headers && response.headers.date ? response.headers.date : 'no response date';
      console.log( 'Status Code:', response.statusCode,
        'Date in Response header:', headerDate );
      response.on('data', chunk => {
        data.push(chunk);  data = JSON.parse(Buffer.concat(data).toString());
        console.log('"data" JSON.parse(Buffer.concat(data).toString()): ',data);
        data.coords = { lng: data.coords[0], lat: data.coords[1] }
        console.log('"data" JSON.parse(Buffer.concat(data).toString()): ',data);
        callback(req,res,data);
      })
      // response.on('end', () => { 
      //   console.log('Response ended, chunk pushed to "data": ',data);
      //   data = JSON.parse(Buffer.concat(data).toString());
      //   console.log('"data" JSON.parse(Buffer.concat(data).toString()): ',data);
      //   renderDetailPage(req,res,data);
      // });
    }
  )
}

const locationInfo = (req, res) => {
  getLocationInfo(req,res,(req,res,responseData) => renderDetailPage(req,res,responseData));
};

const renderReviewForm = (req,res,data) => {
  res.render('location-review-form', { 
    locationid: data._id,
    title: `Write a Review for ${data.name}`,
    pageHeader: { title: `${data.name} => Review Types in cols to new review pages of different form elements for modeling and storage`}
  });
}
const addReview = (req, res) => {
  getLocationInfo(req,res,(req,res,responseData) => renderReviewForm(req,res,responseData));
};
const doAddReview = (req,res) => {// collapsed function due to form direct to api
  console.log('darCalled');
  let locationid = req.params.locationid;
  const postData={author: req.body.name,rating: parseInt(req.body.rating,10),timestamp: new Date(), reviewText: req.body.review}
  let dstring=JSON.stringify(postData);
  console.log('postData info:', dstring, typeof dstring);
  console.log('darRequesting');
  let roptions ={
    // url:`${apiOptions.server}/api/locations/${locationid}/reviews`,
    method: 'POST',
  }
  // console.log('darRedirecting');
  // res.redirect(``)
  let darReq = http.request(
    `${apiOptions.server}/api/locations/${locationid}/reviews`,
    roptions,
    resp => {
      console.log('resping');
      resp.on('data', chunk => console.log('doAddReview Chunk:',chunk));
    }    
  )
  darReq.write(dstring);
}

module.exports = {
  homelist,
  locationInfo,
  addReview,
  doAddReview
};
