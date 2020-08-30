var createError = require('http-errors');
var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var passport = require("passport");
var authenticate = require("./authenticate");

var usersRouter = require('./routes/users');
var mongoose = require("mongoose");
var session = require("express-session");
var FileStore = require("session-file-store")(session);
var config = require("./config");

const url = config.mongoUrl;
const connect = mongoose.connect(url);
connect.then(
  db => {
    console.log("Connected correctly to server");
  },
  err => {
    console.log(err);
  }
);

var app = express();
app.use(passport.initialize()); 
app.use(passport.session()); 

const User = require('./models/user'); 
passport.serializeUser(User.serializeUser()); 
passport.deserializeUser(User.deserializeUser());
  
const LocalStrategy = require('passport-local').Strategy; 
passport.use(new LocalStrategy(User.authenticate())); 
// view engine setup
app.set('views', path.join(__dirname, 'view'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true })); 
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
