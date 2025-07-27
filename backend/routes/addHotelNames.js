var express = require("express");
const fs = require("fs");
var hotelNamesModel = require("../models/hotels");
var router = express.Router();

router.get("/", async () => {
  result = await hotelNamesModel.insertFromJSON();
  return result;
});

module.exports = router;
