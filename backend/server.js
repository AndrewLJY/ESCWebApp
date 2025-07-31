var path = require("path");
var createError = require("http-errors");
var process = require("process");
var db = require("./models/db.js");
const express = require("express");
const cors = require("cors");
require('dotenv').config()

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

process.on("SIGINT", db.cleanup);
process.on("SIGTERM", db.cleanup);

var usersRouter = require("./routes/user");
var indexRouter = require("./routes/index");
var searchRouter = require("./routes/search");
var stripeRouter = require("./routes/stripe");

var userModel = require("./models/user.js");
var bookingModel = require("./models/booking.js");
var destinationNamesModel = require("./models/destinations.js");

//Check if the environment is not set to testing!
if (process.env.NODE_ENV !== "test") {
  userModel.sync();
  bookingModel.sync();
  destinationNamesModel
    .sync()
    .then(() => destinationNamesModel.insertFromJSON());
}

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use("/", indexRouter);
app.use("/auth", usersRouter);
app.use("/search", searchRouter);
app.use("/stripe", stripeRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
