'use strict'

var express = require('express');
var router = express.Router();
var User = require('../models/user');
var mid = require('../middleware');

// Returns the currently authenticated user
router.get('/', mid.userAutho, function(req, res, next) {
  res.send(req.user).json();
  res.status(200);
});

// Creates a user, sets the Location header to "/", and returns no content
router.post('/', function(req, res, next) {
  if (!req.body.fullName || !req.body.emailAddress || !req.body.password) {
    var err = new Error('All fields required.');
    err.status = 400;
    return next(err);
  } else if (err) {
    return next(err);
  } else {
    var newUser = {
      fullName: req.body.fullName,
      emailAddress: req.body.emailAddress,
      password:req.body.password
    }

    // use schema's `create` method to insert document into Mongo
      User.create(newUser, function (error, user) {
        if (error) {
          return next(error);
        } else {
          res.location('/');
          res.status(201).json();
        }
      });
  }
});

module.exports = router;
