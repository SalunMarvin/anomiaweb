// Dependencies Requirement
var express = require('express');
var http = require('http');
var https = require('https');
var bodyParser = require('body-parser');
var axios = require('axios');
var stringify = require('json-stringify-safe');
var querystring = require('querystring');
var mongoose = require('mongoose');
var Card =  require('./models/card');

// Database
let user = 'anomiaweb'
let password = 'b2a5r67'
let database = 'anomiaweb'

mongoose.connect('mongodb://' + user + ':' + password + '@ds111963.mlab.com:11963/' + database);
mongoose.Promise = global.Promise;

// New express application and execution port
var app = express();
var port = process.env.PORT || 8083;

// Disable etag
app.disable('etag');

// Allow URLEncoded and JSON on Request Body
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Allow CORS 
app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

// App Routes
app.post('/get-bio', function (req, res) {
  axios.get('https://torre.bio/api/bios/' + req.body.personId)
    .then(function (response) {
      res.send(stringify(response.data));
    })
    .catch(function (error) {
      return res.status(200).send(error);
    });
});


app.get('/cards/turned', function (req, res) {
  Card.find({ turned: false }).exec().then(docs => {
    let cardsLength = docs.length;
    res.status(200).send({ 'Total': cardsLength });
  }).catch(err => {
    console.log(err);
    res.status(500).json({
        error: err
    });
});
})

app.get('/cards/random', function (req, res) {
  Card.find({ turned: false }).exec().then(docs => {
    let cardsLength = docs.length;
    let randomCard = Math.floor(Math.random() * cardsLength);

    Card.findByIdAndUpdate(docs[randomCard]['_id'],
      { $set: { turned: true } },
      {}, function () {
        res.status(200).send({'Card': docs[randomCard]});
      });
  }).catch(err => {
    console.log(err);
    res.status(500).json({
        error: err
    });
});
})

app.get('/cards/reset', function (req, res) {
  Card.find().exec().then(docs => {
    docs.map((doc) => {
      console.log(doc['_id']);
      Card.findByIdAndUpdate(doc['_id'],
        { $set: { turned: false } },
        {}, function () {
          console.log(doc.turned);
        });
    });

    res.status(200).send({ 'Message': 'Reseted' });
  }).catch(err => {
    console.log(err);
    res.status(500).json({
        error: err
    });
});
})

// Start Server
var server = http.createServer(app).listen(port, function () {
  console.log('Running application on port: ' + port);
});