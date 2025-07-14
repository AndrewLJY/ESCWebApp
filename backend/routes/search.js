var express = require('express');
const fs = require('fs');
var jsonData  = require("../hotelresources/destinations.json");
var destinationModel = require('../models/destinations');

const { json } = require('stream/consumers');
const { getSystemErrorMap } = require('util');
const { type } = require('os');
const { error } = require('console');
var router = express.Router();

const Fuse = require('fuse.js'); //use this library to generate search suggestions and autocomplete in < 1s.


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

// CUSTOM DP SOLUTION FOR SEARCH SUGGESTIONS, USING EDIT DISTANCE BUT TAKES TOO LONG :(
// function getMinimumDistance(word1, word2){
//     if (word2.includes(word1)){
//         return 0;
//     }

//     if(!word2.startsWith(word1[0])){
//         return 999;
//     }

//     dpCache = []
//     for(let i = 0; i < word1.length+1; i++){ //rows
//         row = []
//         for(let j = 0; j < word2.length+1; j++){ //columns
//             row.push(-1);
//         }
//         dpCache.push(row)
//     }

//     //Initialise Base case values
//     for(let i = word1.length; i >-1; i--){
//         dpCache[i][word2.length] = word1.length - i;
//     }

//     for(let j = word2.length; j >-1; j--){
//         dpCache[word1.length][j] = word2.length - j;
//     }

//     for(let i = word1.length-1; i >-1; i--){
//         for(let j = word2.length-1; j >-1; j--){     
//             //If both substrings are equal incur no cost and simply derive cost from follow-up diagonal entry
//             if(word1[i] === word2[j]){
//                 dpCache[i][j] = dpCache[i+1][j+1];
//             }
//             else{
//                 dpCache[i][j] = 1+ Math.min(dpCache[i+1][j], dpCache[i][j+1], dpCache[i+1][j+1]);
//             }
//         }
//     }
//     //End result - cost of edit distance, is the entry at index (0,0)
//     return dpCache[0][0];
// }


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


//Get info for a single hotel, returning the same fields as the API listing hotels for a particular destination
router.get('/hotel/:hotel_id', async function (req, res, next) {
    let hotelId = req.params.hotel_id
    console.log(hotelId);

    const response = await fetch(`https://hotelapi.loyalty.dev/api/hotels/${hotelId}`,{
        method: "GET",
    });

    result = await response.json();
    res.json(result);
})

//Get the room pricings for a specific hotel, at a specific destination
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



const options = {
    threshold: 0.3,
    useExtendedSearch: true,
    caseSensitive:false
};


//Router to generate search suggestions based off database destinaton entries.
router.post('/string/', async function(req, res, next){
    const searchString = req.body.searchString;
    allDestinationNames = await destinationModel.findAllDestinations();
    const fuse = new Fuse(allDestinationNames, options);
    result = fuse.search(searchString, {limit:10});
    res.send(result);



    //CUSTOM DP SOLUTION..TAKE TOO LONG :(
    // const threshold = 5;
    // let possibleDestinations = []
    // let count = 10;
    // let offset = 0;
    // while (count > 0){
    //     offset += 1;
    //     if(allDestinationNames.length === 0){
    //         res.status(500).json({error:"Unable to get more destinations"});
    //         return;
    //     }
    //     for(let destinationName of allDestinationNames){

    //         words = destinationName.split(",");
    //         let netcost = 999;
    //         for(let word of words){
    //             cost = getMinimumDistance(searchString, word)
    //             if (cost < netcost){
    //                 netcost = cost;
    //             }
    //         }

    //         if(netcost <= threshold){
    //             possibleDestinations.push(destinationName);
    //             count -= 1;
    //             if(count < 0){
    //                 break;
    //             }
    //         }
    //     }
    //     console.log(possibleDestinations);
    // }
    // res.send(possibleDestinations);
});

module.exports = router;