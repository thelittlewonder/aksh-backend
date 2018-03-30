const MongoClient = require('mongodb').MongoClient
async function runner( dbUrl, dbName) {
  try {
    var conn = await MongoClient.connect(dbUrl)
    var db = conn.db(dbName)

    let cursor = await db.collection('LULC').find({'metadata.lc_code':'WLSP'}, {'location':1,'id': 0,'metadata': 0})
    let geoCollection = []  
    for (let doc = await cursor.next(); doc != null; doc = await cursor.next()) {
      geoCollection.push(doc)

    }
    // console.log(geoCollection)
    finalGeo = {"type":"GeometryCollection", "geometries": []}
    for (let i of geoCollection){
      finalGeo.geometries.push(i.location)
    }
    console.log(finalGeo)
    conn.close()
    return finalGeo
  } catch (e) {
    console.log('error connecting', e)
    return
  }
}
if (require.main === module){
  let dbUrl = 'mongodb://localhost:27017/'
  let dbName = 'sih'
  runner(dbUrl, dbName)
}
module.exports = {runner}
