'use strict';

// load modules
var express = require('express');
var bodyParser = require('body-parser');
var morgan = require('morgan');
var mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
var seeder = require('mongoose-seeder');
var data = require('./data/data.json');
// var session = require('express-session');
var user = require('./routes/user');
var course = require('./routes/course');

var app = express();

// mongodb connection
mongoose.connect('mongodb://localhost:27017/courseRating');
var db = mongoose.connection;

db.on('error', console.error.bind(console, 'Connection Error:'));

db.once('open', function() {
  console.log('Database Connection Successful');

  // Seed the database
  seeder.seed(data).then(function(dbData) {
      // The database objects are stored in dbData
  }).catch(function(err) {
      // handle error
  });
});

// // use sessions for tracking
// app.use(session({
//   secret: 'treehouse loves you',
//   resave: true,
//   saveUninitialized: false
// }));
//
// // make user ID available in templates
// app.use(function(req, res, next) {
//   res.locals.currentUser = req.session.userId;
//   next();
// });


// parse incoming requests
app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: false }));

// setup our static route to serve files from the "public" folder
app.use('/', express.static('public'));

// set our port
app.set('port', process.env.PORT || 5000);

// morgan gives us http request logging
app.use(morgan('dev'));

// include routes
app.use('/api/users', user);
app.use('/api/courses', course);

// catch 404 and forward to global error handler
app.use(function(req, res, next) {
  var err = new Error('File Not Found');
  err.status = 404;
  next(err);
});

// Express's global error handler
app.use(function (err, req, res, next) {
  console.error(err.stack);
  res.status(err.status || 500);
  res.send({
    message: err.message,
    error: {}
  });
});

// start listening on our port
var server = app.listen(app.get('port'), function() {
  console.log('Express server is listening on port ' + server.address().port);
});
