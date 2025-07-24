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

    /*hash original password 2^10 times, more times means take longer time taken to encrypt(not necessary a bad thing)*/
    const hash_password = await bcrypt.hash(password,10)
    userDbObject = new userModel.User(email,hash_password);
    // userDbObject = new userModel.User(email, password);
    
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
        console.log("User not authorised");
        res.status(401).send("Login unsuccessful.");
    }
});

module.exports = router;