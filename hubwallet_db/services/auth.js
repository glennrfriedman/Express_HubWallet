const bcrypt = require('bcryptjs'),
      User = require('../models/users');

const Auth = {

  // middleware that will be called on all requests
  // it will look for a token, look for a user with that token,
  // and attatch a user object to the request if there is one
  authenticate: (req, res, next) => {
    // get the token
    const token = req.query.auth_token;
    if(token){ // if there is a token
      User // find the user with that token
        .findByToken(token)
        .then(data => { // if there is a user with that token
          req.user = data; // set the user in the request
          next(); // move on to the next action
        })// if there is no user with that token
        .catch(err => {
          req.user = false; // set user to false
          next() // move on to the next action
        })
    } else { // if there is no token
      req.user = false; // no user
      next(); // next action
    }
  },

  // middleware to restrict access to a route
  // to only requests that have a valid user
  restrict: (req, res, next) => {
    if (req.user) { // if there is a user
      next(); // move on to the next action
    } else { // if there is no user
      // send an error back
      res.status(401).json({error: 'user not authorized'});
    }
  },

}

module.exports = Auth;
