'use strict';

var mongoose = require('mongoose');

var CourseSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  estimatedTime: {
    type: String,
    trim: true
  },
  materialsNeeded: {
    type: String,
    trim: true
  },
  steps: [{
    stepNumber: {
      type: Number
    },
    title: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true
    }
  }],
  reviews: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Review'
  }]
});

var Course = mongoose.model('Course', CourseSchema);
module.exports = Course;
