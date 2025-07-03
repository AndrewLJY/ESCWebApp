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
router.get('/add/:email/:password', async function(req, res, next) {
    const email = req.params.email;
    const password = req.params.password;
    userDbObject = new userModel.User(email, password);
    userModel.insertOne(userDbObject);
    const users = await userModel.all();
    res.send(`${JSON.stringify(users)}`);
});


module.exports = router;