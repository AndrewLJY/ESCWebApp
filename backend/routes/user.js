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
router.get('/register/:email/:password', async function(req, res, next) {
    const email = req.params.email;
    const password = req.params.password;
    userDbObject = new userModel.User(email, password);
    userModel.insertOne(userDbObject);
    const users = await userModel.all();
    res.send(`${JSON.stringify(users)}`);
});

/*login check based on added users */

router.get('/login/:email/:password', async function(req, res, next) {
    const email = req.params.email;
    const password = req.params.password;
    console.log(email)
    console.log(password)
    const result = await userModel.login(email, password);
    if (result.success) {
        res.send(JSON.stringify({
            message: "Login successful"
        }));
    } else {
        res.send("Login Failed");
    }
});

module.exports = router;