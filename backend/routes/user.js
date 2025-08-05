const express = require("express");
const userModel = require("../models/user.js");
var bookmarkModel = require("../models/bookmark");
var router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const verifyFunction = require("../../backend/auth_middleware/auth_middleware.js");

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
  if (result.success) {
    const token = jwt.sign(JSON.stringify(user), process.env.SECRET_TOKEN);

    output = {
      user: JSON.stringify(user),
      token: token,
      username: username,
      email: email
    };
    res.send(output);
  } else {
    console.log("User not authorised");
    res.status(401).send("Login unsuccessful.");
  }
});
/*
original function header is router.post("/bookmarks/", verifyFunction,async function(req, res, next)
*/
router.post("/bookmarks/", async function (req, res, next) {
  console.log("Hello!!!! I am accessing bookmarks now.");
  //retrieve infos for bookmark
  const hotel_id = req.body.hotel_id;
  const hotel_name = req.body.hotel_name;
  const hotel_address = req.body.hotel_address;
  const image_url = req.body.image_url;
  const hotel_ratings = req.body.hotel_ratings;
  const userID = req.body.userID;

  const bookmark = new bookmarkModel.Bookmark(
    hotel_id,
    hotel_name,
    hotel_address,
    image_url,
    hotel_ratings,
    userID
  );

  try {
    //try to insert into bookmark table
    result = await bookmarkModel.insertOne(bookmark);
    if (result == 1) {
      return res.send("Successfully bookmarked");
    } else if (result == -1) {
      return res.send("Already bookmarked");
    }
  } catch (error) {
    console.error("database error " + error);
  }
});

router.get("/allBookmarks/:user_email", async function (req, res, next) {
  userEmail = req.params.user_email;
  try {
    let bookmarks = await bookmarkModel.getAllBookmarksPerUser(userEmail);
    console.log(bookmarks);
    res.send(bookmarks);
  } catch (error) {
    console.error("database error" + error);
  }
});

router.post("/deleteBookmark", async function (req, res, next) {
  hotelId = req.body.hotel_id;
  try {
    result = await bookmarkModel.removeHotelBookmark(hotelId);
    if (result === -1) {
      res.status(500).send("Error, hotel does not exist in database");
      return;
    }
    res.status(200).send("Deleted");
    return;
  } catch (error) {
    console.error("database error" + error);
  }
});

module.exports = router;
