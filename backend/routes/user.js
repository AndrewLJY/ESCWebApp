const express = require('express');
const userModel = require('../models/user.js');
var router = express.Router();

router.post('/submit/', async function(req, res, next) {
    const name = req.body.email;
    const code = req.body.password;

    await userModel.insertOne(userModel.User.newUser(email, password));
    const users = await userModel.all();
    res.set('Access-Control-Allow-Origin', 'http://localhost:5173'); //React frontend
    res.send(`${JSON.stringify(users)}`);
})

/* insert a staff, should have used POST instead of GET */
router.post('/register/', async function(req, res, next) {
    const email = req.body.email;
    const password = req.body.password;
    userDbObject = new userModel.User(email, password);
    userModel.insertOne(userDbObject);
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