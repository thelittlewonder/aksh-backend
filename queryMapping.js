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
        let factor;
        if (parameters['unit-length'].unit ==='m')
            factor = 1;
        else if (parameters['unit-length'].unit ==='km')
            factor = 1000;
        else if (parameters['unit-length'].unit ==='mi')
            factor = 1600;
        let distance = radius * factor;

        switch(parameters.poi) {
            case 'schools':
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

    find_future_X: function (parameters) {

    }
}


module.exports = {mapping}
