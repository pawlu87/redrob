// Get the packages we need
var express      = require('express');
var mongoose     = require('mongoose');
var connectMongo = require('connect-mongo');
var bodyParser   = require('body-parser');
var passport     = require('passport');
var session      = require('express-session');
var morgan       = require('morgan');
var flash        = require('connect-flash');
//var Store      = require('connect').session.Store

var configMongo   = 'mongodb://localhost:27017/redrob';


// Connect to the redrob MongoDB
mongoose.Promise = require('bluebird');
mongoose.connect(configMongo, { });

var port = process.env.PORT || 3000;

// Create our Express application
var app = express();

app.use(morgan('dev')); // log every request to the console
app.use(bodyParser.urlencoded({ extended: false })) // parse application/x-www-form-urlencoded
app.use(bodyParser.json()) // parse application/json
//app.use(MongoStore);

const MongoStore = connectMongo(session);

// Use the passport package in our application
app.use(passport.initialize());

// required for passport session
app.use(session({
  secret: 'secrettexthere',
  saveUninitialized: true,
  resave: true,
  // using store session on MongoDB using express-session + connect
  store: new MongoStore({ mongooseConnection: mongoose.connection })
}));

app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session


/* ROUTING */
require('./app/routes.js')(app, express, passport);

// Start the server
app.listen(port);
console.log('Running redrob account on port: ' + port);
