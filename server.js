const express    = require('express');
const path       = require('path');
const bodyParser = require("body-parser");
const dotenv     = require('dotenv');
const mongodb    = require("mongodb");
const request    = require('request');
const async      = require('async');
const ObjectID   = mongodb.ObjectID;

dotenv.config();

const URL = {
  ENDPOINT:'https://maps.googleapis.com/maps/api/geocode/json'
};

function calculateMarkers(place_1, items) {
  const latitude  = place_1.results[0].geometry.location.lat;
  const longitude = place_1.results[0].geometry.location.lng;

  const newCoords = [];

  for(let i = 0; i < items; i++){
    let r = 1000/111300 // = 100 meters
    , y0 = latitude
    , x0 = longitude
    , u = Math.random()
    , v = Math.random()
    , w = r * Math.sqrt(u)
    , t = 2 * Math.PI * v
    , x = w * Math.cos(t)
    , y1 = w * Math.sin(t)
    , x1 = x / Math.cos(y0);

    const newY = y0 + y1;
    const newX = x0 + x1;

    newCoords.push({
      lat: newY,
      lng: newX
    });
  }

  return newCoords;

}

const app = express();
app.use(express.static(__dirname + "/public"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

app.set('view engine', 'jade');
app.set('views', path.join(__dirname, '/public/views'));

app.locals.env = process.env;


let db;

// Connect to the database before starting the application server.
mongodb.MongoClient.connect(process.env.MONGODB_URI, function (err, database) {
  if (err) {
    console.log(err);
    process.exit(1);
  }

  // Save database object from the callback for reuse.
  db = database;
  console.log("Database connection ready");

  // Initialize the app.
  const server = app.listen(process.env.PORT || 3000, function () {
    const port = server.address().port;
    console.log("App now running on port", port);
  });
});

app.get('/', function(req, res){
  res.render('index', { title: 'Welcome to Google Maps Generator', params:{place_1: '', items:10, markers:''}});
});




app.get('/tracking-101', (req, res) => {
  let docs = [];
  const cursor = db.collection('tracking').find({});

  cursor.each(function(err, doc){

    if(doc !== null){
      docs.push(doc);
    } else {
      db.close();
      res.status(200).send(JSON.stringify(docs));
    }

  });


});

app.post('/google-maps-action', (req, res) => {

  if(req.body.place_1 === ''){
    res.redirect('/');
  }
  const params = {
    place_1: req.body.place_1,
    items: req.body.items,
    coords: JSON.parse(req.body.local),
    ip:req.headers['x-forwarded-for'] || req.connection.remoteAddress,
    date: new Date(),
    originalPlace: null,
    markers:[]
  };

  async.parallel({
    place_1: function(callback) {
      if(params.place_1.length === ''){
        callback();
      }
      request(URL.ENDPOINT +'?address='+params.place_1+"&key="+process.env.GEO_API_KEY, function (error, response, body) {
        if (!error && response.statusCode == 200) {
          callback(null, JSON.parse(body));
        }
      });

    },
    local:function(callback){
      request(URL.ENDPOINT +'?latlng='+params.coords.lat+","+params.coords.lng+"&key="+process.env.GEO_API_KEY, function (error, response, body) {
        if (!error && response.statusCode == 200) {
          callback(null, JSON.parse(body));
        }
      });
    }
}, function(err, results) {
    const markers = calculateMarkers(results.place_1, params.items);
    params.markers = markers;
    params.originalPlace = results.local;

    db.collection('tracking').insert(params, function(err, results){
      //console.log('results',results);
    });

    params.markers = JSON.stringify(markers);

    res.render('index.jade', {title: 'Welcome to Google Maps Generator' ,params: params});

});



});

app.get('*', (req, res) => {
  res.redirect('/');
});
