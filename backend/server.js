
const express = require("express");

const app = express();

const port = process.env.PORT | 5000;

var indexRouter = require('./routes/index');

app.use('/',indexRouter);

module.exports = app;

app.listen(port, () => console.log(`Nodemon server is running!`));

