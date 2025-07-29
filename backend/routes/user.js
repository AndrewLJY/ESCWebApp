const express = require("express");
const userModel = require("../models/user.js");
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
      email: username,
    };
    res.send(output);
  } else {
    console.log("User not authorised");
    res.status(401).send("Login unsuccessful.");
  }
});

router.get("/bookmarks/", verifyFunction, (req, res, next) => {
  console.log("Hello");
  res.send("Hello!!!! I am accessing bookmarks now.");
});

module.exports = router;
