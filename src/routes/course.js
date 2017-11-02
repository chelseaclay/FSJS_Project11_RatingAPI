'use strict'

var express = require('express');
var router = express.Router();
var User = require('../models/user');
var Course = require('../models/course');
var Review = require('../models/review');
var mid = require('../middleware');

// Returns the Course "_id" and "title" properties
router.get('/', function(req, res, next) {
  Course.find({}, 'title _id', function(err, courses) {
    res.send(courses);
    res.status(200);
  });
});

// Returns all Course properties and related documents for the provided course ID
// use Mongoose population to load the related user and reviews documents.
router.get('/:courseId', function(req, res, next) {
  Course.findById(req.params.courseId).populate('user reviews').exec(function(error, courses) {
    if (error) {
      return next(error);
    } else {
      res.send(courses);
      res.status(200);
    }
  });
});

// Creates a course, sets the Location header, and returns no content
router.post('/', mid.userAutho, function(req, res, next) {
  if (!req.body.title || !req.body.description || !req.body.estimatedTime || !req.body.materialsNeeded || !req.body.steps) {
    var err = new Error('All fields required.');
    err.status = 400;
    return next(err);
  } else if (err) {
    return next(err);
  } else {
    var newCourse = {
      title: req.body.title,
      description: req.body.description,
      estimatedTime: req.body.estimatedTime,
      materialsNeeded: req.body.materialsNeeded,
      steps: req.body.steps
    }

    // use schema's `create` method to insert document into Mongo
    Course.create(newCourse, function (error, courses) {
      if (error) {
        return next(error);
      } else {
        res.location('/');
        res.status(201).json();
      }
    });
  }
});

// Updates a course and returns no content
router.put('/:courseId', mid.userAutho, function(req, res, next) {
  Course.findByIdAndUpdate(req.params.courseId, req.body, function(error){
    if(error){
      error.status = 400;
      return next(error);
    }
    res.status(201).json();
  });
});

// Creates a review for the specified course ID, sets the Location header to the related course, and returns no content
router.post('/:courseId/reviews', mid.userAutho, function(req, res, next) {
  Course.findById(req.params.courseId).populate('user reviews').exec(function(error, courses) {
    if (error) {
      error.status = 400;
      return next(error);
    } else {

      // use schema's `create` method to insert document into Mongo
      Review.create(req.body, function (error, courses) {
        if (error) {
          return next(error);
        } else {
          res.location('/' + req.params.courseId);
          res.status(201).json();
        }
      });
    }
  });
});

module.exports = router;
