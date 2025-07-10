var express = require('express');
var router = express.Router();
let jsonData; 

async function loadJsonData(filePath) {
  try {
    const response = await fetch(filePath);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const jsonData = await response.json(); // Parse the JSON response
    console.log(jsonData); // Work with the parsed JSON data
    return jsonData;
  } catch (error) {
    console.error('Error fetching JSON:', error);
  }
}


async function GetHotels(term, jsonData){
    let destination = jsonData.find(item => item.term == term);
    //if destination not NULL
    if (destination){
        let uid = destination.uid;
        const response = await fetch("https://hotelapi.loyalty.dev/api/hotels?",{
            method: "POST",
            headers:{
                "Content-Type":"application/x-www-form-urlencoded",
            },
            body: new URLSearchParams({destination_id:uid})
        });
        return await response.json(); // should return the hotel data, let the endpoint response to user
    }
}

router.get('/dest/:destination_name', async function(req, res, next){ 
    const data = await loadJsonData("../hotel_resources/destinations.json");

    const destination = req.params.destination_name;
    if (!data){
          res.status(500).json({error:'unable to load json data'})
    }
    const hotelData = await GetHotels(destination,data);
    if (!hotelData){
          res.status(500).json({error:`unable to get hotel data of ${destination_name}`});
    }
    res.json(hotelData); //respond to user
});

module.exports = router;