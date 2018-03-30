const fs = require('fs')
const Papa = require('papaparse')
const MongoClient = require('mongodb').MongoClient


function removeHiddenFiles(filelist) {
    return filelist.filter(f => !f.startsWith('.'))
}

function readAllCSV(datadir) {
    let files = fs.readdirSync(datadir)
    files = removeHiddenFiles(files)
    let csvfiles = files.filter(f => f.endsWith('csv'))
    let keys = csvfiles.map(f => f.split('_')[1].split('.')[0])

    let data = {}
    for (let i = 0; i < keys.length; i++) {
        // trim required because files have trailing whitespace
        let content = fs.readFileSync(`${datadir}/${csvfiles[i]}`).toString().trim()
        data[keys[i]] = Papa.parse(content, {header: true}).data
    }
    return data
}

function readAllGeoJson(datadir) {
    let files = fs.readdirSync(datadir)
    files = removeHiddenFiles(files)
    let geojsonfiles = files.filter(f => f.endsWith('json'))
    let keys = geojsonfiles.map(f => f.split('_')[1].split('.')[0])

    let data = {}
    for (let i = 0; i < keys.length; i++) {
        data[keys[i]] = require(`${datadir}/${geojsonfiles[i]}`)
    }
    return data
}

function combineCSVandGeoJson(allCSV, allGeoJson) {
    let combinedData = {}

    for (let key of Object.keys(allCSV)) {
        // each key goes to each collection in Mongo
        // entries are individual records in a collection
        let entries = []
        for (let i = 0; i < allCSV[key].length; i++) {
            entries.push({
                location: allGeoJson[key].geometries[i],
                metadata: allCSV[key][i]
            })
        }
        combinedData[key] = entries
    }
    return combinedData
}

async function insertCombinedDataToMongo(combinedData, dbUrl, dbName) {
    try {
        var conn = await MongoClient.connect(dbUrl)
        var db = conn.db(dbName)
    } catch (e) {
        console.log('error connecting', e)
        return
    }

    for (let coll of Object.keys(combinedData)) {
        // console.log('Inserting', combinedData[coll].length, 'items to', coll)
        process.stdout.write(`Dropping collection ${coll} ... `)
        // await db.dropCollection(coll)
        process.stdout.write(' DONE \n')

        process.stdout.write(`Inserting ${combinedData[coll].length} items to ${coll} ... `)
        await db.collection(coll).insertMany(combinedData[coll])
        process.stdout.write(' DONE \n')
        // console.log('DONE')
    }

    await conn.close()
    console.log('All entries made successfully')
}


module.exports = {readAllCSV, readAllGeoJson, combineCSVandGeoJson, insertCombinedDataToMongo}


if (require.main === module) {
    // console.log(readAllCSV('./dataset/Kurudu-csv'))
    // console.log(readAllGeoJson('./dataset/Kurudu-geojson'))

    let allCSV = readAllCSV('./dataset/Kurudu-csv')
    let allGeoJson = readAllGeoJson('./dataset/Kurudu-geojson')
    let combinedData = combineCSVandGeoJson(allCSV, allGeoJson)
    // console.log(combinedData)
    console.log(combinedData['LULC'][0])

    let dbUrl = 'mongodb://localhost:27017/'
    let dbName = 'sih'
    insertCombinedDataToMongo(combinedData, dbUrl, dbName)
}
