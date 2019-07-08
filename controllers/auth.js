// Load required packages
let passport = require('passport');
let LocalStrategy = require('passport-local').Strategy;
let User = require('../models/user');

passport.serializeUser(function(user, done) {
   done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});

passport.use('local-login', new LocalStrategy({
    // by default, local strategy uses username and password, we will override with email
    usernameField : 'email',
    passwordField : 'password',
    passReqToCallback : true // allows us to pass back the entire request to the callback
},
  function(req, email, password, callback) {
    User.findOne({ 'local.email': email }, function (err, user) {
      if (err) { return callback(err); }

      // No user found with this email
      if (!user) { return callback(null, false); }
      // Password did not match
      if (!user.validPassword(password)) { return callback(null, false);}

      //Success
      return callback(null, user);
    });
  })
);

exports.isAuthenticated = passport.authenticate("local-login", { failureRedirect: "http://localhost:8080/login"});