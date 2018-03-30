const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors')

const makeNLPQuery = require('./dialog').makeQuery
const geoSpatialQuery = require('./concat_geo').runner

makeNLPQuery('suggest a place to build a hospital')

app.use(express.static(__dirname+'/public'));
app.use(bodyParser.json());
app.use(cors({credentials: true, origin: true}))

let dbUrl = 'mongodb://localhost:27017/'
let dbName = 'sih'

app.get('/query',async (req, res) => {
    let q = req.query.query
    // makeNLPQuery(q)
  
    let r = await geoSpatialQuery(dbUrl, dbName)
    res.json(r)
});

	
app.listen(3006);
console.log('Running on port 3006...');
