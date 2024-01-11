const goo = require('mongoose');
const Y = goo.model('Year');

//  currentActivityTypeSchemaKeys (cATSK)
let cATSK={
    1:'intentPhysicalActivities',
    2:'intentGroupActivities',
    3:'expectedRoutineActivities'
}

const intentActivitiesCreate = (req,res) => {    let y = req.params.year; let f = req.params.fortnight; 
    let {pomGroup,pomCode,pomName,pomBegin,pomEnd,pomQd} = req.body;
    console.log('CREATE intent activity => y: ',y,'f: ',f,'\nForm body: ', req.body,"\ndestruct check: ",pomGroup);

    let CREATEbegin = new Date(pomBegin); let CREATEend = new Date(pomEnd);

    let postUtcBegin = new Date( Date.UTC(
        CREATEbegin.getFullYear(),CREATEbegin.getMonth(),CREATEbegin.getDate(),
        CREATEbegin.getHours(),CREATEbegin.getMinutes()
    ) );
    let postUtcEnd = new Date( Date.UTC(
        CREATEend.getFullYear(),CREATEend.getMonth(),CREATEend.getDate(),
        CREATEend.getHours(),CREATEend.getMinutes()
    ) );
    const postData={
        activityName: pomName,
        activityCode: pomCode,
        duration: { begin: postUtcBegin, end: postUtcEnd }  //  individual activities can have : { INTENSIT(userQueried), FREQUENCY(accumulatedWithChosenAveragingPeriod), MODALITY(predetermined), METs, METsConvertedToCalories, stepsEquivalent, durationAdherence, associatedComments, unassociatedComments, relatedActivities }
    }
    
    Y.find({year:y}).then( yr => { if(!yr || yr.length == 0) return res.status(404).json({msg: 'year not found'});
        switch(pomGroup){
            case 'Intended Physical Activity':
                yr[0].fortnights[f-1].days[pomQd-1][cATSK[1]].push(postData);
                break;
            case 'Intended General Activity':
                yr[0].fortnights[f-1].days[pomQd-1][cATSK[2]].push(postData);
                break;
            case 'Expected Routine Activity':
                yr[0].fortnights[f-1].days[pomQd-1][cATSK[3]].push(postData);
                break;
        }
        yr[0].save();
    }).catch(ce => console.log('intentActivitiesCreate CATCH:',ce));
    res.redirect(`/years/${y}/${f}`);
};
const intentActivitiesUpdate = (req,res) => {    let y = req.params.year; let f = req.params.fortnight; 
    console.log('PUT controller params: ',req.params,'query: ',req.query);
    let {id,begin,end,type} = req.query;
    console.log("update destruct begin end: ", begin,end);
    let UPDATEbegin = new Date(begin); let UPDATEend = new Date(end);
    console.log("update destruct Ub Ue: ", UPDATEbegin, UPDATEend);

    let putUtcBegin = new Date( Date.UTC(
        UPDATEbegin.getFullYear(),UPDATEbegin.getMonth(),UPDATEbegin.getDate(),
        UPDATEbegin.getHours(),UPDATEbegin.getMinutes()
        ) );
    let putUtcEnd = new Date( Date.UTC(
        UPDATEend.getFullYear(),UPDATEend.getMonth(),UPDATEend.getDate(),
        UPDATEend.getHours(),UPDATEend.getMinutes()
        ) );

    console.log("update destruct PUb PUe: ", putUtcBegin, putUtcEnd);
    
            
    Y.find({year:y}).then( yr => {  if(!yr || yr.length == 0) return res.status(404).json({msg: 'year not found'});
        console.log("update query begin ...");
        let f0 = yr[0].fortnights[f-1].day1Fzero.getUTCDate();
        let qdt = putUtcBegin.getUTCDate();
        let di = qdt - f0;
        console.log('update day index (f0 - qdt = di): ',f0, qdt, di);

        for(let ai=0;ai<yr[0].fortnights[f-1].days[di][type].length;ai++){
            console.log("typeMatching: ",type,yr[0].fortnights[f-1].days[di][type][ai]._id);
            if(yr[0].fortnights[f-1].days[di][type][ai]._id!=id) continue;
            console.log("typeMatch: ",type);
            yr[0].fortnights[f-1].days[di][type][ai].duration.begin = putUtcBegin;
            yr[0].fortnights[f-1].days[di][type][ai].duration.end = putUtcEnd;
            console.log("update: ",yr[0].fortnights[f-1].days[di][type][ai].duration.end);
            yr[0].save();
            break;
        }

    }).catch( ce => console.log("intentActivitiesUpdate CATCH: ", ce) );

    res.redirect(303,`/years/${y}/${f}`);
};
const intentActivitiesDelete = (req,res) => {    let y = req.params.year; let f = req.params.fortnight; 
    
    let d = '';
    for(c of req.query.id){  if(c == 'd') break;
        d+=c;
    }
    d = parseInt(d);
    console.log('DEL intent activity => y: ',y,'f: ',f,"\nDEL req.params:",req.params,"\nDEL req.query:",req.query,"DELETE d: ",d);
    let dt = new Date(req.query.aTime);    let type = req.query.aType;

    Y.find({year:y}).then( yr => {
        if(!yr || yr.length == 0) return res.status(404).json({msg: 'year not found'});
        console.log(`DELETE activity of year ${y}, fortnight ${f}`);
        console.log('   aTime: ',dt)
        for(let ai=0;ai<yr[0].fortnights[f-1].days[d-1][type].length;ai++){
            console.log("ai++");
            console.log('   Time: ',yr[0].fortnights[f-1].days[d-1][type][ai].duration.end)
            if(dt.getTime()==yr[0].fortnights[f-1].days[d-1][type][ai].duration.end.getTime()){
                console.log("attempting DELETE",yr[0].fortnights[f-1].days[d-1][type][ai])
                yr[0].fortnights[f-1].days[d-1][type][ai].deleteOne();
                yr[0].save();
                return;
            }
        }
    })
    .catch(ce => console.log('4-3delTest CATCH:',ce))
    // req.method = 'GET'; console.log("redirecting", req.method)
    res.redirect(303,`/years/${y}/${f}`)
};

const adheredActivitiesCreate = (req,res) => {
    return;
};

const activeTimesUpdate = (req, res) => {
    return;
}

module.exports = {
    intentActivitiesCreate,
    // intentActivitiesRead, 
    intentActivitiesUpdate, 
    intentActivitiesDelete,
    adheredActivitiesCreate,
    // adheredActivitiesRead,
    // adheredActivitiesUpdate,
    // adheredActivitiesDelete,
    activeTimesUpdate,
}