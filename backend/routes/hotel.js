var express = require('express');
const fs = require('fs');
var jsonData  = require("../hotelresources/destinations.json");
const { json } = require('stream/consumers');
var router = express.Router();

async function loadJsonData(filePath) {
    fs.readFile(filePath, 'utf-8', (error, jsonData) => {
      if(error){
        throw error;
      }
      return jsonData;
    });
}


async function GetHotels(term, jsonData){
    let destination = jsonData.find(item => item.term == term);
    if (destination){
        let uid = destination.uid;
        console.log("UId",uid);

        //Provided API by Ascenda handles GET Requests.
        const response = await fetch(`https://hotelapi.loyalty.dev/api/hotels?destination_id=${uid}`, {
          method: "GET",
        });
        return await response.json();
    }
    else{
      return "Destination File not found";
    }
}

router.get('/dest/:destination_name', async function(req, res, next){ 
    const data = jsonData;

    let destination = req.params.destination_name;
    destination = destination.replace("_"," ");
    console.log(destination);

    if (!data){
        return res.status(500).json({error:'unable to load json data'})
    }
    const hotelData = await GetHotels(destination,jsonData);
    console.log("Gotten!");
    console.log(hotelData);
    if (!hotelData){
        return res.status(500).json({error:`unable to get hotel data of ${destination_name}`});
    }
    res.json(hotelData); //respond to user
});

module.exports = router;