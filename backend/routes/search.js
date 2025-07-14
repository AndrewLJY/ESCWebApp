var express = require('express');
const fs = require('fs');
var jsonData  = require("../hotelresources/destinations.json");
const { json } = require('stream/consumers');
const { getSystemErrorMap } = require('util');
var router = express.Router();


// |Helper Functions Start--------------------------------------------------------------------------------|

async function getHotelID(term, jsonData){
    let destination = jsonData.find(item => item.term == term);
    if (destination){
        let uid = destination.uid;
        console.log("UId",uid);
        return uid;
    }
    else{
      return "-1";
    }
}



function stitchHotelJsonData(hotelPricingData, hotelDataFromDest){
    finalHotelsDetails = []

    hotels = hotelPricingData.hotels
    if(!hotels){
        res.send("Error finding hotels");
        return;
    }

    for (let i = 0; i < hotels.length; i++){
        hotelId = hotels[i].id;
        for(let k = 0; k < hotelDataFromDest.length; k++){
            if (hotelId === hotelDataFromDest[k].id){
                compiledHotelData = Object.assign(hotelDataFromDest[k], hotels[i])
                finalHotelsDetails.push(compiledHotelData);
            }
        }
    }

    return finalHotelsDetails;
}

// |Helper Functions End-------------------------------------------------------------------------------|


// |Main route:                                                                                        |
// |Displaying List of Hotels with Prices for given duration of stay, destination and number of guests.|

router.post('/', async function(req, res, next){ 

    //Required Request Body Parameters:
    let destination = req.body.destination_name;
    let checkInDate = req.body.check_in_date;
    let checkOutDate = req.body.check_out_date;
    let language = req.body.language;
    let currency = req.body.currency;
    let countryCode = req.body.country_code;
    let guestCount = req.body.guest_count;
    let partnerId = req.body.partner_id;


    const data = jsonData; //Bring over main json data file

    if (!data){
        return res.status(500).json({error:'unable to load json data'})
    }
    let destinationId = await getHotelID(destination,jsonData);
    if(destinationId === "-1"){
        res.send("Destination not found");
        return;
    }

    const response = await fetch(`https://hotelapi.loyalty.dev/api/hotels?destination_id=${destinationId}`, {
        method: "GET",
    });

    destAPIData = await response.json(); //Results from Dest API

    let priceAPIData = {"hotels":[]};
    let count = 0;

    while (priceAPIData.hotels.length === 0)
    {
        if (count > 2){
            return res.status(500).json({error: 'Unable to Find any Hotels at the moment'});
        }

        const response2 = await fetch(`https://hotelapi.loyalty.dev/api/hotels/prices?destination_id=${destinationId}&checkin=${checkInDate}&checkout=${checkOutDate}&lang=${language}&currency=${currency}&country_code=${countryCode}&guests=${guestCount}&partner_id=${partnerId}`,{
            method: "GET",
        });
        priceAPIData = await response2.json(); //Results from Price API
        count++;
    }

    if (!priceAPIData || !destAPIData){
        return res.status(500).json({error: 'Unable to Find any Hotels at the moment'});
    }

    compiledData = stitchHotelJsonData(priceAPIData, destAPIData);

    res.json(compiledData);
});








// |Other Routes---------------------------------------------------------------------------------------------------|


router.get('/hotel/:hotel_id', async function (req, res, next) {
    let hotelId = req.params.hotel_id
    console.log(hotelId);

    const response = await fetch(`https://hotelapi.loyalty.dev/api/hotels/${hotelId}`,{
        method: "GET",
    });

    result = await response.json();
    res.json(result);
})

router.post('/hotel/prices', async function(req, res, next){
    let hotelId = req.body.hotel_id;
    let destinationId = req.body.destination_id;
    let checkInDate = req.body.check_in_date;
    let checkOutDate = req.body.check_out_date;
    let language = req.body.language;
    let currency = req.body.currency;
    let countryCode = req.body.country_code;
    let guestCount = req.body.guest_count;
    let partnerId = req.body.partner_id;


    let result = {"rooms":[]}
    let count = 0;

    while (result.rooms.length === 0)
    {
        if (count > 3){
            res.send("Unable to retrieve data, check for errors in request parameters.");
            break
        }

        const response = await fetch(`https://hotelapi.loyalty.dev/api/hotels/${hotelId}/price?destination_id=${destinationId}&checkin=${checkInDate}&checkout=${checkOutDate}&lang=${language}&currency=${currency}&country_code=${countryCode}&guests=${guestCount}&partner_id=${partnerId}`,{
            method: "GET",
        });
        result = await response.json();
    }

    return result;
});


module.exports = router;