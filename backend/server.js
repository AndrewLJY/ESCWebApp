var path = require('path');
var createError = require('http-errors');
var process = require('process');
var db = require('./models/db.js');
const express = require("express");

const app = express();


process.on('SIGINT', db.cleanup);
process.on('SIGTERM', db.cleanup);

var usersRouter = require('./routes/user');
// var bookingRouter = require('./routes/booking');
var indexRouter = require('./routes/index');


var userModel = require('./models/user.js');
var bookingModel = require('./models/booking.js');

userModel.sync();
bookingModel.sync();
// bookingModel.makeReference();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');


app.use('/', indexRouter);
app.use('/users', usersRouter); //link to user module under routes/user.js
// app.use('/bookings', bookingRouter); //link to booking module under routes/booking.js


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




