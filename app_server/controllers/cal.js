var yday = new Date(2023, 5, 13); var today = new Date()
var this_year_jan_1st_unix = new Date(today.getFullYear(),0,1);


function dateLog() {console.log(
    "server/controllers/cal test logging",
    "\n|| || millisPerDay:  t/24/60/60/1000 = t/86400000",
    "|| || millisPerWeek:  t/7/24/60/60/1000 = t/604800000",
    "|| || millisPerFortnight:  t/2/7/24/60/60/1000 = t/1209600000\n",
    );
console.log(
    "|| || new Date(YYYY<Number>, MM<Number>, DD<Number>)",
    "|| || this_year_jan_1st_unix<Date>: ", this_year_jan_1st_unix,
    "|| || this_year_jan_1st_unix<Date>: ", this_year_jan_1st_unix.getMilliseconds(),
    "|| || this_year_jan_1st_unix<Date>: ", this_year_jan_1st_unix.getMilliseconds() +100000,
    "|| || this_year_jan_1st_unix<Date>: ", this_year_jan_1st_unix.getMilliseconds() +900,
    "|| || yday<Date>: ", yday,
    "yday_unix_days = yday<Date>/86400secs: ", yday/86400000,
    "|| || today<Date>: ", today,
    "today_unix_days = today<Date>/86400secs: ", today/86400000,
    "|| || today.getFullYear() <Number>: ", today.getFullYear(),
    "|| || today.toString(): ",today.toString(),
    "|| || today.toUTCString(): ", today.toUTCString(),
    "|| || today.getMonth(): ", today.getMonth(),
    );
console.log("days between yday and today: ", (today-yday)/86400000);
console.log("todayUnixWeeks: ", today/604800000);
console.log("todayUnixWeeksSince Jan1st2023: ", (today-this_year_jan_1st_unix)/604800000);
console.log("todayUnixFortnightsSince Jan1st2023: ", (today-this_year_jan_1st_unix)/604800000/2);
}

//  aim to experience inhibitory control with a weekly rudder to settle into a fortnights basis for 18 months
biasList=[
    'vigorous_musle_building',
    'moderate_muscle_building','moderate_muscle_building',
    'moderate_muscle_building','moderate_muscle_building',
    'moderate_aerobic','vigorous_aerobic'
]
adherenceList=[ 'under_adherent', 'adherent', 'over_adherent' ];
daysNames=['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'];
timesOfDay=['Early AM','Morning','Afternoon','Evening'];
function mins_time(number){ return [parseInt(number/60),number%60]; }

//SCHEMA
timesOfDayBounds={  // if user is strict waking for 4 years, change_all_weeks()
    Early_AM_Begin:mins_time(240),Early_AM_End:mins_time(419),
    Morning_Begin:mins_time(420),Morning_End:mins_time(719),
    Afternoon_Begin:mins_time(720),Afternoon_End:mins_time(1019),
    Evening_Begin:mins_time(1020),Evening_End:mins_time(1200)
}
// console.log(this_year_jan_1st_unix.getTime())
yearsList = [];
fortnightsList=[];
midnights = 0;
var startYear = new Date(today.getFullYear(),0,1);
for(let y=0;y<10;y++){
    console.log('ser/cont/cal fnightList logging');
    year = {}
    year['number']=startYear.getFullYear();
    for(let i=1;i<=27;i++){
        fzero = new Date(startYear.getTime() + (i-1)*1209600000);
        
        fortnight={}; fortnight['ordinal_number']=i;
        fortnight['unixes']=[];

        ndays=14
        if(i==27){
            ndays=1
            eoy=new Date(fzero.getTime() + 86400000); 
            console.log("eoy: ",eoy,"year:",year['number'],"eoyGetY:",eoy.getFullYear());
            if(eoy.getFullYear()==year['number']) ndays = 2;
        }
        for(d=0;d<ndays;d++){
            mins = [];
            for(m=0;m<144;m++){
                mins.push(new Date(fzero.getTime() + 86400000*d + 60000*m*10));
            }
            fortnight['unixes'].push(mins);
        }

        fortnight['cal-mon_title']='th Fortnight of 2029'  //  remove from schema (rfs)
        if(i%10==1) fortnight['cal-mon_title']='st Fortnight of 2029'
        if(i%10==2) fortnight['cal-mon_title']='nd Fortnight of 2029'
        if(i%10==3) fortnight['cal-mon_title']='rd Fortnight of 2029'
        if(parseInt(i/10)==1) fortnight['cal-mon_title']='th Fortnight of 2029'

        fortnight['pending']=true;  // greyed or saturation change for card bg or page bg  //  RFS
        if((today-this_year_jan_1st_unix)/604800000/2 > i) fortnight['pending']=false;

        // fortnight['day_names']=daysNames;  //  RFS
        fortnight['card_titles']=[  //  RFS
            'Margin','Calendar of Timeslots','Waking Active Times',
            'Modes','Nutrient Balance','Json/Rules Header','Comments'
        ]
        fortnight['margin_subheadings']=['Citation References','Main Citation Content','Formatting Example','Full Real Example'];  //  RFS
        fortnight['scheduled_cal_view']={
            title: 'Calendar: Schedule of Timeslots',  //  RFS
            context: 'Hover over Timeslots to see scheduled activities',  //  RFS
            draft_button_text: 'Draft a schedule for your activities',  //  RFS
            day_col: 'Days',  //  RFS
            times_of_day: timesOfDay,  //  RFS  <<<<<
            times_of_day_bounds: timesOfDayBounds,
            //  PAList consumer, fortnight.PAList should have ConsumerSchema
            scheduled_activities: [ //  vcals 
                {
                    ATTENDEES:'',

                },
                {

                }
            ],
            modal_placeholder: 'modalGeo'  //  RFS
        }
        fortnight.scheduled_cal_view.scheduled_activities.push({INVITE:true})
        // all schema members line below can be inferred with name and Duration.
        // fortnight.PAList:[newSchema{name:String RFS,PADurationSchema{Insuff:Number,RegM:Number,RegV:Number,Long:Number},PAIntensitySchema{},PAFreqSchema{},PAMod{}}],
        fortnight['adhered_cal_view']={
            title: 'Adhered Calendar (Admin View)',  //  RFS
            context: 'The Differences between Scheduled and Adhered will be color coded. Phone location data should be broadly permitted to allow location inference (eg, outdoor period is minimum distance from known indoor location',  //  RFS
            draft_button_text: 'Draft a notification for the user/usergroup',  //  RFS
            day_col: 'Days',  //  RFS
            times_of_day: timesOfDay,  //  RFS
            times_of_day_bounds: timesOfDayBounds,
            modal_placeholder: 'modalGeo'  //  RFS
        }
        fortnight['modes']={
            title: 'Modes',  //  RFS
            mode_list: [
                { name: 'inhibitory_control', mode: 2 },
                { name: 'fatigue', mode: 1 },  // opinion based and analysis based poll issuance at the end of each fortnight
                { name: 'pa_bias', mode: biasList[Math.floor(Math.random()*biasList.length)] },  // opinion based and analysis based poll issuance at the end of each fortnight},
                { name: 'placeholder_adherent', mode: adherenceList[Math.floor(Math.random()*adherenceList.length)] },  // adherence function by Carlo
                { name: 'overall_adherent', mode: '(MA from placeholder) Adherent' }  // weighted average to indicate reliability of adherence behaviour, 6 week, 9 week average, plot moving average
            ]
        }
        fortnight['nutrient_balance']={  // logged or 6 week averaged
            title: 'Nutrient Balance',  //  RFS
            food_list: [
                {   name: 'eggs', 
                    measure_list: [ {measure: Math.ceil(Math.random()*3 +3), unit: 'count'} ]},
                {   name: 'olive_oil', 
                    measure_list: [ {measure: Math.ceil(Math.random()*50 +200), unit: 'calories'} ]},
                {   name: 'butter', 
                    measure_list: [ {measure: Math.ceil(Math.random()*10 +60), unit: 'calories'} ]}
            ]
        }
        fortnight['comments']={
            title:'Comments',  //  RFS
            button_text:'Add Comment',  //  RFS
            comments_list: [
                {author:'',labels:[],timeStamp:'',commentText:'Strict Olive Oil Calories'},
                {author:'',labels:[],timeStamp:'',commentText:'No Cooking with Fat'},
                {author:'',labels:[],timeStamp:'',commentText:'Standing on 1 Leg'}
            ]
        };
        fortnight['rules_header']={  //  RFS, rule-ify
            title: 'Rules Header',
            click_holding: 'Held',
            rules_list: [
                { rule_meaning: 'Adherent', ont_reasoned_rule_text:'?adherentWhoAdherence' },  // breaking down into rule components is a requirement for fullness of description
                { rule_meaning: 'Inferred_Fatigue: 1', ont_reasoned_rule_text:'?PreviousPhysicalActivityDurationsAndTypes' }
            ]
        };  // queue of 2 rules maximum, option to keep either pane and hold pushing or auto push the top pane to below and load new rule to top pane or freeze either pane
        fortnightsList.push(fortnight);
    }
    year['fortnights'] = fortnightsList;
    fortnightsList = [];
    yearsList.push(year);
    startYear = new Date(startYear.getFullYear()+1,0,1);
}
console.log(
    "\n", fzero,
    "\n", fzero.getTime(),
    // Object.keys(fortnightsList[21]).slice(0,4),
    fortnightsList.length, new Date(), 
);

for(u=0;u<144;u++){
    if(u%80==0){
        console.log(
            yearsList[0].fortnights[8].unixes[13][u],
            "13th day is Sunday:",yearsList[0].fortnights[8].unixes[13][u].getDay(),
            "27th Fortnight has 1 days:", yearsList[0].fortnights[26].unixes[0][u],
            "LeapYear 27th Fortnights have 2 days:",yearsList[1].fortnights[26].unixes[1][u],
        );
    }
}
decade_years = []
yearsList.forEach(y => decade_years.push(y.number))
console.log("dyears:",decade_years);
// console.log(yearsList[0].fortnights[0].scheduled_cal_view.scheduled_activities);

const http = require('http');

const renderDecadeList = (req,res,data) => {
    let stored = true;
    if(data.length == 0) stored = false;
    let today = new Date(); let thisyear = today.getFullYear; 
    let decadeRender = { 
        pre: stored, current_year: thisyear, 
        view_years: decade_years, years: data,
        content: 'increase string length with 1. changing PA relation to longevity over long duration, 2. Periods of the body'
    }
    return res.render('cal-decade', decadeRender);
}
const decadeList = (req, res) => { 
    http.get( `http://localhost:3400/api/years`, response => { let data=[]; 
        const headerDate = response.headers && response.headers.date ? response.headers.date : 'no response date'; console.log( 'Status Code:', response.statusCode, 'Date in Response header:', headerDate );
        response.on('data', chunk => { data.push(chunk);  console.log('data <- chunk:',data); });
        response.on('end', () => { console.log('decadeList response.end log');
            data = JSON.parse(Buffer.concat(data).toString()); console.log('"data" JSON.parse(Buffer.concat(data).toString()): ',data);
            renderDecadeList(req,res,data);
        })
    });
};

const renderCal = (req,res,data) => {
    res.render('cal-mon', { 
        title: 'Calendar',
        year: req.params.year,    fortnight: req.params.fortnight,
        testWake: 4,
        days: data.days
    });
};
const cal = (req, res) => { 
    console.log('scroll loaded');
    http.get( `http://localhost:3400/api/years/${req.params.year}/${req.params.fortnight}`, response => { let data=[]
        response.on('data', chunk => { console.log('chunk received'); data.push(chunk)});
        response.on('end', () => { data = JSON.parse(Buffer.concat(data).toString()); console.log('"data" JSON.parse(Buffer.concat(data).toString()): ',data.days[4]);
            renderCal(req,res,data);
        });
    });
};

const renderDraftSch = (req, res, data) => {
    res.render('cal-draft-sch', { 
        title: 'draft a schedule for review by your trainer' 
    });
};
const draftSch = (req, res) => {
    renderDraftSch(req,res);
};

const renderActivityForm = (req,res) => {
    res.render('cal-mon-activity-form', {
        year: req.params.year,
        fortnight: req.params.fortnight
    });
}
const activityForm = (req,res) => {
    renderActivityForm(req,res);
}

const renderFortnightList = (req,res,data) => {
    let dataFortnights = data[0].fortnights;
    let renderListFortnights = [];
    console.log("array?",data);
    for(let f =0; f<dataFortnights.length; f++){
        f_el = {
            ordinal_number: dataFortnights[f].ordinalNumber,
            day1_fzero: dataFortnights[f].day1Fzero
        }
        renderListFortnights.push(f_el)
    }
    res.render('cal-fortnights-list', { 
        year: req.params.year,
        title: 'Fortnights of This Year',
        today: '',
        fortnights: renderListFortnights
    });
}
const fortnightList = (req, res) => {
    console.log(req.params.year);
    http.get( `http://localhost:3400/api/years/${req.params.year}`,
        response => {
            let data = [];  const headerDate = response.headers && response.headers.date ? response.headers.date : 'no response date';
            console.log( 'Status Code:', response.statusCode, 'Date in Response header:', headerDate );
            if(response.statusCode!=200) return res.status(response.statusCode).json({msg:'api/years/:year is empty'});
            response.on('data', chunk => { data.push(chunk);  console.log('data <- chunk:',data); });
            response.on('end', () => { console.log('fortnightList response.end log')
                data = JSON.parse(Buffer.concat(data).toString()); console.log('"data" JSON.parse(Buffer.concat(data).toString()): ',data);
                renderFortnightList(req,res,data);
            })
        }  
    );
};

module.exports = {
    decadeList,
    cal,
    draftSch,
    activityForm,
    fortnightList
};

console.log("server/controllers/cal test logging closeing after module exports");