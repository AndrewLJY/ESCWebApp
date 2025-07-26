const express = require('express');
const userModel = require('../models/user.js');
var router = express.Router();
const bcrypt = require('bcrypt')

router.post('/submit/', async function(req, res, next) {
    const name = req.body.email;
    const code = req.body.password;

    await userModel.insertOne(userModel.User.newUser(email, password));
    const users = await userModel.all();
    res.set('Access-Control-Allow-Origin', 'http://localhost:5173'); //React frontend
    res.send(`${JSON.stringify(users)}`);
})

/* insert an user, should have used POST instead of GET */
router.post('/register/', async function(req, res, next) {
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
    const hash_password = await bcrypt.hash(password,10)
    userDbObject = new userModel.User(email,hash_password);
    
    userModel.insertOne(userDbObject);
    console.log("account registered successfully");

    const users = await userModel.all();
    res.send(`${JSON.stringify(users)}`);
});

/*login check based on added users */
router.post('/login/', async function(req, res, next) {
    const email = req.body.email;
    const password = req.body.password;
    console.log(email)
    console.log(password)
    const result = await userModel.login(email, password);
    if (result.success) {
        res.send(JSON.stringify({
            message: "Login successful"
        }));
    } else {
        res.console.error("Login Failed");
    }
});

module.exports = router;