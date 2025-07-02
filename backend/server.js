const express = require("express");
const app = express();
const cors = require('cors');

const port = process.env.PORT | 8080;

app.use(cors());

var indexRouter = require('./routes/index');
app.use('/',indexRouter);

module.exports = app;
app.listen(port, () => console.log(`Nodemon server is running!`));

