// this file maps intent from DialogFlow to respective query in queries.js

const queries = require('./queries');

let dbUrl = process.env.MONGO_URL;
let dbName = process.env.MONGO_DB;


queries.setupDatabase(dbUrl, dbName);


const mapping = {

    'Default Fallback Intent': async function (parameters) {
        return {
            message: 'Sorry, I could not recognize this command',
            geoInfo: null,
            showInCards: false
        }
    },

    find_in_radius: async function (parameters) {

        let radius = parameters['unit-length']['amount'];
        radius = radius === undefined ? 100000: radius
        // console.log(radius)
        let factor = 1 ;
        if (parameters['unit-length'].unit ==='m')
            factor = 1;
        else if (parameters['unit-length'].unit ==='km')
            factor = 1000;
        else if (parameters['unit-length'].unit ==='mi')
            factor = 1600;
        let distance = radius * factor;

        switch(parameters.poi) {
            case 'schools':
            console.log(distance)
                let schools = await queries.findSchoolsInRadius(distance);
                return {
                    message: `There are ${schools.length} schools in given radius.`,
                    geoInfo: schools,
                    showInCards: true
                }
                break;

            case 'hospitals':
                let hospitals = await queries.findHospitalsInRadius(distance);
                return {
                    message: `There are ${hospitals.length} hospitals in given radius.`,
                    geoInfo: hospitals,
                    showInCards: true
                }
                break;
        }
    },

    find_future_X: async function (parameters) {

        let number = parameters['number'];
        
        var cas = parameters['availability'];

        switch(cas) {

            case 'findAvailabilityWasteLand':
                
                number = number == ''? 100: number
                let area = 0.000000009643762973 * number;
                // area = 0
                let futureX = await queries.findWasteLand();
                
                let filteredAnswer = [];
                
                for (var i = futureX.length - 1; i >= 0; i--) {
                    console.log(futureX[i].metadata.Shape_Area, area)
                    console.log(typeof(futureX[i].metadata.Shape_Area), typeof(area))
                    if(futureX[i].metadata.Shape_Area >= area) {
                        filteredAnswer.push(futureX[i]);
                    }
                }
                console.log(filteredAnswer);
                return {
                    message: `We found ${filteredAnswer.length} suitable location.`,
                    geoInfo: filteredAnswer,
                    showInCards: true
                }
            break;
        }
    },

    find_current_X: async function(parameters){
        let current = parameters['current'];
        let cursor;
        let ans;
        let message;

        switch(current) {
            case 'getReservoir':
                ans = await queries.genericFind('LULC', {'metadata.lc_code':'WBRT'})
                message: `Found ${ans.length} locations.`
                break;
            case 'getCanal':
                ans = await queries.genericFind('LULC', {'metadata.dscr2':'Canal'})
                message: `Found ${ans.length} locations.`
                break;
            case 'getAllWater':
                ans = await queries.genericFind('LULC', {'metadata.dscr3':'Water bodies'})
                message: `Found ${ans.length} locations.`
                break;
            case 'getMines':
                ans = await queries.genericFind('LULC', {'metadata.dscr3':'Mining / Industrial'})
                message: `Found ${ans.length} locations.`
                break;
            case 'getDrainage':
                ans = await queries.genericFind('LULC', {'metadata.dscr3':''})
                message: `Found ${ans.length} locations.`
                message: `Found ${ans.length} locations.`
                break;
            case 'getTransport':
                ans = await queries.genericFind('LULC', {'metadata.dscr3':'Transportation'})
                message: `Found ${ans.length} locations.`
                break;
            case 'population':
                ans = queries.describeDemography()
                console.log(ans)
                message = `There are ${ans.population} people with sex ration ${ans.sex_ratio} and ${ans['0_6_age']} children.`
                ans = null
                break

            default :
                console.log('no match') 
        }  
        return {
            message: message,
            geoInfo: ans,
            showInCards: true
        }
    },

    find_nearest_NH: async function(parameters) {
        let result = await queries.findNearestNationalHighway();
        return {
            message: `Nearest national highway is at approximately ${result.distance} kilometers`,
            geoInfo: [result.gp, result.nh],
            showInCards: false
        };
    },

    navigate: async function(parameters) {
        let village  = parameters.navigate_to
        if (village === 'chandlodiya'){
            return {
                message: `Navigating to ${village}.`,
                intent: {
                    action: 'move_to',
                    loc :{  
                        lng:72.5410875,lat:23.0632311
                    },
                    zoom: 21
                },
                geoInfo: []
            }
        } else{
            return {
                message: `Navigating to ${village}.`,
                intent: {
                    action: 'move_to',
                    loc: {lng:84.1538802, lat:18.5337648},
                    zoom: 14
                },
                geoInfo: []
            }
        }
        
    }

}


module.exports = {mapping}
