// this file maps intent from DialogFlow to respective query in queries.js

const queries = require('./queries');

const dbUrl = 'mongodb://localhost:27017'
const dbName = 'sih'


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
                let area = 0.000000009643762973 * number;
                let futureX = await queries.findWasteLand();
                
                let filteredAnswer = [];
                
                for (var i = futureX.length - 1; i >= 0; i--) {
                    console.log(futureX[i].metadata.Shape_Area, area)
                    console.log(typeof(futureX[i].metadata.Shape_Area), typeof(area))
                    if(futureX[i].metadata.Shape_Area <= area) {
                        filteredAnswer.push(futureX[i].location);
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
        switch(current) {
            case 'getReservoir':
                ans = await queries.genericFind('LULC', {'metadata.dscr3':'Reservoir / Tanks'})
                break;
            case 'getCanal':
                ans = await queries.genericFind('LULC', {'metadata.dscr2':'Canal'})
                break;
            case 'getAllWater':
                ans = await queries.genericFind('LULC', {'metadata.dscr3':'Water bodies'})
                break;
            case 'getMines':
                ans = await queries.genericFind('LULC', {'metadata.dscr3':'Mining / Industrial'})
                break;
            case 'getDrainage':
                ans = await queries.genericFind('LULC', {'metadata.dscr3':''})
                break;
            case 'getTransport':
                ans = await queries.genericFind('LULC', {'metadata.dscr3':'Transportation'})
                break;
            default :
                console.log('no match') 
        }  
        return {
            message: `Found ${ans.length} locations.`,
            geoInfo: ans,
            showInCards: true
        }
    },

    find_nearest_NH: async function(parameters) {
        let result = queries.findNearestNationalHighway();
        return {
            message: `Nearest national highway is at approximately ${result.distance} kilometers`,
            geoInfo: [result.gp, result.nh],
            showInCards: false
        };
    }

}


module.exports = {mapping}
