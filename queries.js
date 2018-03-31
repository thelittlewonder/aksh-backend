const MongoClient = require("mongodb").MongoClient;

var conn, db;

async function setupDatabase(dbUrl, dbName) {
  try {
    conn = await MongoClient.connect(dbUrl);
    db = conn.db(dbName);
  } catch (e) {
    console.log("error connecting to database", e);
    return;
  }
}

async function cursorToArray(cursor) {
  let result = [];
  for (let doc = await cursor.next(); doc != null; doc = await cursor.next()) {
    result.push(doc);
  }
  return result;
}

async function findSchools() {
  let cursor = await db.collection("School").find();
  let schools = await cursorToArray(cursor);
  return schools;
}

async function findHospitals() {
  let cursor = await db.collection("Hospital").find();
  let hospitals = await cursorToArray(cursor);
  return hospitals;
}

async function findDrainage() {
  let cursor = await db.collection("Drainage").find(
    {
      "metadata.dr_code": "DRST"
    }
 
  );
  let drainage = await cursorToArray(cursor);
  return drainage;
}

async function findCanals() {
  let cursor = await db
    .collection("Drainage")
    .find({ "metadata.dr_code": { $in: ["CANM", "CAND"] } });
  let canals = await cursorToArray(cursor);
  return canals;
}

async function slope(fcode) {
    //Translation from fcode from class should be done by dialogflow
  let cursor = await db.collection("Slope").find(
    {
      "metadata.fcode": fcode
    }
    
  );
  let slopes = await cursorToArray(cursor);
  return slopes;
}

async function findSchoolsInRadius(radius) {
  // there's just GP available this time. So, just consider that
  let kuruduGp = await db.collection("Panchayat").findOne();

  let cursor = await db.collection("School").find({
    location: {
      $near: {
        $geometry: kuruduGp.centroid,
        $maxDistance: radius,
        $minDistance: 0
      }
    }
  });

  let schools = await cursorToArray(cursor);
  return schools;
}

async function showPanchayatArea(){
  let cursor = await db.collection('Panchayat').find()
  let panchayat = await cursorToArray(cursor)
  return panchayat  
}

async function findByRoadType(type){
    let cursor = await db.collection('Road').find(
        {'metadata.type': type}
    )
    let roads = await cursorToArray(cursor)
    return roads

}
async function findByRoadStatus(status){
    let cursor = await db.collection('Road').find(
        {'metadata.status': status}
    )
    let roads = await cursorToArray(cursor)
    return roads
}

async function showVillage(villname){
    //get villname somehow
    let cursor = await db.collection('Village').find(
        {'metadata.villname': villname}
    )
    let village = await cursorToArray(cursor)
    return village
}

async function findWasteLand() {
    let cursor = db.collection('LULC').find({'metadata.dscr3':'Barren rocky'})
    let wasteLands = await cursorToArray(cursor);

    return wasteLands;
}


async function findHospitalsInRadius(radius) {
  // there's just GP available this time. So, just consider that
  let kuruduGp = await db.collection("Panchayat").findOne();

  let cursor = await db.collection("Hospital").find({
    location: {
      $near: {
        $geometry: kuruduGp.centroid,
        $maxDistance: radius,
        $minDistance: 0
      }
    }
  });

  let hospitals = await cursorToArray(cursor);
  return hospitals;
}


module.exports = {
    setupDatabase,
    findSchools,
    findHospitals,
    findDrainage,
    findCanals,
    findSchoolsInRadius,
    findHospitalsInRadius,
    findWasteLand
};


if (require.main === module) {
  async function _inner() {
    let dbUrl = "mongodb://localhost:27017";
    let dbName = "sih";
    await setupDatabase(dbUrl, dbName);

    // console.log(await findSchoolsInRadius(1000));
    // console.log(await findHospitalsInRadius(2000));
    console.log(await findByRoadType('Kutchha Road'))
    console.log(await findByRoadStatus('Village Road'))
    
    conn.close();
  }
  _inner();
}
