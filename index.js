const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');

const makeNLPQuery = require('./dialog').makeQuery;
const queryMapping = require('./queryMapping').mapping;
// const geoSpatialQuery = require('./concat_geo').concatGeoJsons;

// makeNLPQuery('suggest a place to build a hospital')

app.use(express.static(__dirname+'/public'));
app.use(bodyParser.json());
app.use(cors({credentials: true, origin: true}))

let dbUrl = 'mongodb://localhost:27017/';
let dbName = 'sih';

app.get('/nlp', async (req, res) => {
    let q = req.query.q;
    let d = await makeNLPQuery(q);
    console.log(d);
  
    let r = await queryMapping[d.metadata](d.parameters);
    console.log(r)
    // let r = await geoSpatialQuery(dbUrl, dbName);
    res.json(r);
});

	
app.listen(3001);
console.log('Running on port 3000...');
