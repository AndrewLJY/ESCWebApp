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
        res.send(response);
    }
}

router.post('/dest/:destinaton_name', async function(req, res, next){
    loadJsonData("../hotel_resources/destinations(1).json");
    const destination = req.params.destinaton_name;
    GetHotels(destination,jsonData);//res.send, no need to console log to display
});

module.exports = router;