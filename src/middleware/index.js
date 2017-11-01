'use strict'

const auth = require('basic-auth');
const User = require('../models/user');

function userAutho(req, res, next) {
  var credentials = auth(req);

  if (!credentials) {
    var err = new Error('User not found.');
    err.status = 401;
    return callback(err);
  } else {
    User.authenticate(credentials.name, credentials.pass, function (error, user) {
      if (error || !user) {
        var err = new Error('Wrong email or password.');
        err.status = 401;
        return next(err);
      }  else {
        req.user = user;
        next();
      }
    });
  }
}

module.exports.userAutho = userAutho;
