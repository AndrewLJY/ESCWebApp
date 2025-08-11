const express = require("express");
const userModel = require("../models/user.js");
var bookmarkModel = require("../models/bookmark");
var router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const verifyToken = require("../../backend/auth_middleware/auth_middleware.js");

var validEmail =
  /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

// router.post('/submit/', async function(req, res, next) {
//     const name = req.body.email;
//     const code = req.body.password;
//
//     await userModel.insertOne(userModel.User.newUser(email, password));
//     const users = await userModel.all();
//     res.set('Access-Control-Allow-Origin', 'http://localhost:5173'); //React frontend
//     res.send(`${JSON.stringify(users)}`);
// })

/* insert an user, should have used POST instead of GET */
router.post("/register/", async function (req, res, next) {
  const email = req.body.email;
  const password = req.body.password;

  // Email format validation (simple regex)
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || !emailRegex.test(email)) {
    return res.status(400).send("Invalid email format.");
  }

  // Password non-empty validation
  if (!password || password.trim() === "") {
    return res.status(400).send("Password cannot be empty.");
  }

  /*hash original password 2^10 times, more times means take longer time taken to encrypt(not necessarily a bad thing)*/
  const hash_password = await bcrypt.hash(password, 10);
  userDbObject = new userModel.User(email, hash_password);

  userModel.insertOne(userDbObject);
  console.log("account registered successfully");

  const users = await userModel.all();
  res.send(`${JSON.stringify(users)}`);
});

/*login check based on added users */
router.post("/login/", async function (req, res, next) {
  const email = req.body.email;
  const password = req.body.password;

  //String slicing, remove all characters behind the "@" to generate a username
  username = email.split("@")[0];

  const user = await userModel.findByEmail(email);
  console.log(user);
  const result = await userModel.login(email, password);
  console.log("RESULT IS :" + result);
  if (result.success) {
    console.log("Success!");

    let token;

    if (process.env.NODE_ENV === "test") {
      token = "test-token";
    } else {
      token = jwt.sign(JSON.stringify(user), process.env.SECRET_TOKEN);
    }

    output = {
      token: token,
      username: username,
      email: email,
    };
    res.send(output);
  } else {
    console.log("User not authorised");
    res.status(401).send("Login unsuccessful.");
  }
});
/*
original function header is router.post("/bookmarks/", verifyToken,async function(req, res, next)
*/
router.post("/bookmarks/", verifyToken, async function (req, res, next) {
  //retrieve infos for bookmark
  const hotel_id = req.body.hotel_id;
  const hotel_name = req.body.hotel_name;
  const hotel_address = req.body.hotel_address;
  const image_url = req.body.image_url;
  const hotel_ratings = req.body.hotel_ratings.toString();
  const user_email = req.body.user_email;
  const search_string = req.body.search_string;
  const destination_id = req.body.destination_id;

  const bookmark = new bookmarkModel.Bookmark(
    hotel_id,
    hotel_name,
    hotel_address,
    image_url,
    hotel_ratings,
    user_email,
    destination_id,
    search_string
  );

  //Check for the proper types

  if (!image_url.slice(0, 4).includes("http")) {
    return res.status(400).json("Invalid image url input");
  }

  if (hotel_id.length !== 4) {
    console.log("hotel id");
    return res.status(400).json("Invalid hotel id");
  }

  let count = 0;
  for (let i = 0; i < hotel_id.length; i++) {
    if (!isNaN(hotel_id.charAt(i))) {
      count += 1;
    }
    if (count > 2) {
      console.log("hotelid");
      return res.status(400).json("Invalid hotel id");
    }
  }

  let hotel_ratingsCopy = hotel_ratings;
  if (Number(hotel_ratingsCopy) < 0 || Number(hotel_ratingsCopy) > 5) {
    console.log("ratings");
    return res.status(400).json("Invalid ratings");
  }

  if (!validEmail.test(user_email)) {
    console.log("email");
    return res.status(400).json("Invalid email");
  }

  try {
    //try to insert into bookmark table
    result = await bookmarkModel.insertOne(bookmark);
    if (result == 1) {
      return res.status(200).send("Successfully bookmarked");
    } else if (result == -1) {
      return res.status(200).send("Already bookmarked");
    }
  } catch (error) {
    res.status(400).send("Database error");
    console.error("database error " + error);
  }
});

router.get(
  "/allBookmarks/:user_email",
  verifyToken,
  async function (req, res, next) {
    userEmail = req.params.user_email;

    // Email format validation (simple regex)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!userEmail || !emailRegex.test(userEmail)) {
      return res.status(400).send("Invalid email format.");
    }

    try {
      let bookmarks = await bookmarkModel.getAllBookmarksPerUser(userEmail);
      console.log(bookmarks);
      res.send(bookmarks);
    } catch (error) {
      res.status(400).json("Bad Request");
      console.error("database error" + error);
    }
  }
);

router.post("/deleteBookmark", verifyToken, async function (req, res, next) {
  hotelId = req.body.hotel_id;
  user_email = req.body.user_email;

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!user_email || !emailRegex.test(user_email)) {
    return res.status(400).send("Invalid email format.");
  }

  try {
    result = await bookmarkModel.removeHotelBookmark(hotelId, user_email);
    if (result === -1) {
      res.status(400).send("Error, hotel does not exist in database");
      return;
    }
    res.status(200).send("Deleted");
    return;
  } catch (error) {
    console.error("database error" + error);
  }
});

module.exports = router;
