'use strict';

var mongoose = require('mongoose');

var ReviewSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  postedOn: {
    type: Date,
    default: Date.now
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
    trim: true
  },
  review: {
    type: String,
    trim: true
  }
});

var Review = mongoose.model('Review', ReviewSchema);
module.exports = Review;
