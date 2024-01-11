const goo = require('mongoose');
const Y = goo.model('Year');

function delTest(){
    Y.findById('6537eea370de9a40ccd8751c')
        .then(y=>{
            console.log("delTest:",y.fortnights.id('6537eea370de9a40ccd875c9').days.id('6537eea370de9a40ccd875d3'))
            y.fortnights.id('6537eea370de9a40ccd875c9')
                .days.id('6537eea370de9a40ccd875d3')
                .deleteOne();
            y.save();
        })
        .catch(ce => console.log('4-3delTest CATCH:',ce))
}
function findTest(){
    // Y.findOne({year:2023})  //  allows promiseResolve.mongooseKeyTry
    Y.findById('6537eea370de9a40ccd8751c')
        .then(y=>{
            console.log("Attempting find.find: ", Object.keys(y));
            console.log("Attempting find.find: ", Object.keys(y.fortnights));
            console.log("findTest:",y.fortnights[4].ordinal_number);   //  indexing day containers is by ordinal. there is no option to delete days.
        }).catch(ce => console.log('4-3findTest CATCH:',ce))
}
// delTest();
// findTest();

const yearsList = (req, res) => {
    Y.find().then( decade => { return res.status(200).json(decade); } )
        .catch(e => console.log('/api/years Catch err:', e));
};
//  currentRoutineCodesNamesMinutes  (cRCNM)
let cRCNM = [  
    { name: 'Do Not Disturb', code: 'r000', begin: 5, mins: 50 },
    { name: 'Cook And Eat Breakfast', code: 'r001', begin: 6.5, mins: 40 },
    { name: 'Cook And Eat Lunch', code: 'r002', begin: 12, mins: 70 },
    { name: 'Cook And Eat Dinner', code: 'r003', begin: 17, mins: 70 },
    { name: 'Sleep Prep', code: 'r010', begin: 21.75, mins: 70 }
]

const defWakeSleepStringToFloat = (l4string24Time) => {
    if(parseInt(l4string24Time.slice(2,4)) < 0 || parseInt(l4string24Time.slice(2,4)) > 59) return console.log('invalid wake minutes, will fail schema validation');
    return parseInt(l4string24Time.slice(0,2)) + parseInt(l4string24Time.slice(2,4))/60
}
const yearfortnightsCreate = (req, res) => { let today = new Date(); let thisyear = today.getFullYear();
    let comingdecade = []; for(let i=0;i<10;i++) comingdecade.push(thisyear + i);
    const year = req.params.year;
    fortnightsList=[];
    yearStart = new Date(Date.UTC(year,0,1,0,0,0,0));
    console.log('req.params.year: ',year,'YEARSTART: ',yearStart,'YEARSTART ISO: ',yearStart.toISOString());
    for(let i=1;i<=27;i++){ 
        fzero = new Date(yearStart.getTime() + (i-1)*1209600000);
        console.log('yearStart: ',yearStart,'FZERO:',fzero);
        fortnight={}; fortnight['ordinalNumber']=i; fortnight['day1Fzero'] = fzero;
        ndays=14;
        if(i==27){  ndays=1; eoy=new Date(fzero.getTime() + 86400000); 
            console.log("eoy: ",eoy,"year:",year['number'],"eoyGetY:",eoy.getFullYear());
            if(eoy.getFullYear()==year['number']) ndays = 2;
        }
        // fortnight['pending']=true;  // greyed or saturation change for card bg or page bg  //  RFS
        // if((today-this_year_jan_1st_unix)/604800000/2 > i) fortnight['pending']=false;      
        
        fortnight['wakingDuration'] = { begin: 5, end: 21.5 }
        fortnight['days'] = [];        
        for(d=0;d<ndays;d++){ 
            // for(hh=0;hh<24;m++){
            let [iPA, iGA, eRA] = [[],[],[]]
            let today = new Date(fzero.getTime() + 86400000*d);
            let todayDay = today.getDay();
            if(todayDay==0 || todayDay==3){
                let iga = {  //  weekly/fornightly schedule, short list, including some that are like normal physcial activities, should always include a METs, eg for poker, you are sitting
                    activityName: 'Poker Tournament',
                    activityCode: 'g001',
                    duration: {
                        begin: new Date(today.getTime() + ((18*60)+30)*60000),  //  codesSet with time map, updates to time map or codeSet by various admins
                        end: new Date(today.getTime() + ((21*60)+30)*60000)
                    }
                }
                iGA.push(iga);
            }

            for(let ra=0;ra<cRCNM.length;ra++){
                let era = {  
                    activityName: cRCNM[ra].name,
                    activityCode: cRCNM[ra].code,
                    duration: {
                        begin: new Date(today.getTime() + ( cRCNM[ra].begin*60 )*60000),
                        end: new Date(today.getTime() + ( cRCNM[ra].begin*60 + cRCNM[ra].mins )*60000)
                    }    
                }
                eRA.push(era);
            }
            let ipaNA = {  //  schema 'required' satisfied by NA
                activityName: 'No Activity',
                activityCode: '1000',
                duration: {
                    begin: new Date(today.getTime() + (3.5*60)*60000),
                    end: new Date(today.getTime() + (5*60)*60000)
                }
            };
            
            let day = { 
                dayOrdinal: d+1,  
                date: today,
                intentPhysicalActivities: [ipaNA],  //  PUT
                intentGroupActivities: iGA,  //  UNSTATIC, POST, PUT, DEL
                expectedRoutineActivities: eRA  //  POST, PUT, DEL, DEF
            }
            fortnight['days'].push(day);
        }
        fortnightsList.push(fortnight);
    }
    console.log('Y.create log');
    Y.create({ year: req.params.year, fortnights: fortnightsList })
    .then( yr => { 
        if(!yr || yr.length == 0) return res.status(400).json({ msg: "bad request" });
        res.status(201).json({ msg:"Year successfully stored", year: yr.year});
    }).catch(e => console.log('create error e:',e))
    res.redirect('/years/')
};
const fortnightsListByOrder = (req, res) => {
    Y.find({year: req.params.year}).then( fortnights => {
        console.log('list Querying', req.params.year);
        if(!fortnights||fortnights.length==0) { console.log('empty collection return'); 
            // res.status(404).json({ possible_issue: 'collection is empty, trying CREATE' }); 
            return yearfortnightsCreate(req,res); 
        }
        res.status(200).json(fortnights);
    } ).catch( err => { return res.status(404).json({ logged: err }); });
};

const renderFortnightList = (req,res) => {
    console.log(`rendering attempt for year ${req.params.year}`);
    Y.find({year: req.params.year}).then( fortnights => {
        console.log('render querying');
        if(!fortnights) {console.log('attempting CREATE controller without POST router');yearfortnightsCreate(req,res);}
        console.log('List Function ->');
        return fortnightsListByOrder(req,res);
    } ).catch( err => { console.log('render query CATCH'); res.status(404).json({ logged: err, msg: 'renderFunction' }); });
}

const fortnightsReadOne = (req, res) => {
    Y.find({ year: req.params.year }).then( yoy => {
        if(!yoy){ return res.status(404).json({ log: 'ObjectId doesnt exist' }); }
        let qf=yoy[0].fortnights[parseInt(req.params.fortnight) - 1]
        res.status(200).json(yoy[0].fortnights[parseInt(req.params.fortnight) - 1]);
    }).catch( err => { res.status(404).json(err); });
};
const fortnightsUpdateOne = (req, res) => {
    res.status(200).json({msg:"placeholder"});
};
const fortnightsDeleteOne = (req, res) => {
    res.status(200).json({msg:"placeholder"});
};

module.exports = {
    yearsList,
    yearfortnightsCreate,
    renderFortnightList,
    fortnightsListByOrder,
    fortnightsReadOne,
    fortnightsUpdateOne,
    fortnightsDeleteOne
}