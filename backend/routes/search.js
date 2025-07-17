var express = require('express');
const fs = require('fs');
var jsonData  = require("../hotelresources/destinations.json");
var destinationModel = require('../models/destinations');
var compiledData;

const { json } = require('stream/consumers');
const { getSystemErrorMap } = require('util');
const { type } = require('os');
const { error } = require('console');
var router = express.Router();

const Fuse = require('fuse.js'); //use this library to generate search suggestions and autocomplete in < 1s.
const { resolve } = require('path');

var hotelDataTransferServiceModule = require('../hotel_data/hotel_data_service');
const { route } = require('./user');



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

function transferSingleHotelJSONToClass(jsonData){
    hotelDataTransferService = new hotelDataTransferServiceModule.HotelDataTransferService(jsonData);
    if (hotelDataDTOClassList.getPriceAvailability() === false){
        singleHotelDataDTO = hotelDataTransferService
        .transferKeyDetails()
        .transferImageDetails()
        .transferITrustYouScore()
        .transferAmenitiesData()
        .transferOriginalMetaData()
        .getNewHotelDataDTOClass();
    }

    else{
        singleHotelDataDTO = hotelDataTransferService
        .transferKeyDetails()
        .transferImageDetails()
        .transferITrustYouScore()
        .transferOriginalMetaData()
        .transferPricingRankingData()
        .transferAmenitiesData()
        .getNewHotelDataDTOClass();
    }

    return singleHotelDataDTO;
}



// |Helper Functions End-------------------------------------------------------------------------------|


//Class to Store List of All Compiled Hotel Data DTO
//To be exported to MIDDLEWARE!
class HotelDataDTOClassList{
    constructor(){
        this.hotelDataDTOs = [];
        this.bPriceDataUnavailable = false;
    }
    addHotelDataDTO(hotelDataDTO){
        this.hotelDataDTOs.push(hotelDataDTO);
    }

    getListHotels(){
        return this.hotelDataDTOs;
    }

    setPriceDataUnavailable(bUnavailable){
        this.bPriceDataUnavailable = bUnavailable;
    }

    getPriceAvailability(){
        return this.bPriceDataUnavailable;
    }

    
}

var hotelDataDTOClassList = new HotelDataDTOClassList(); //Declare with Global Scope



// |Main route:                                                                                        |
// |Displaying List of Hotels with Prices for given duration of stay, destination and number of guests.|

router.post('/', async function(req, res, next){ 

    //Required Request Body Parameters:
    const destination = req.body.destination_name;
    const checkInDate = req.body.check_in_date;
    const checkOutDate = req.body.check_out_date;
    const language = req.body.language; //acquire from frontend settings, default is en_US
    const currency = req.body.currency; //can acquire from frontend, default is SGD / USD --> Both lead to same results
    const guestCount = req.body.guest_count;
    const roomCount = req.body.room_count;


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
    
    if(!destAPIData){
        console.error(500).json({error: "Unable to retrieve data from given destination."});
    }

    guestInputField = `${guestCount}`;
    for(let i = 1; i < roomCount; i++){
        guestInputField += `|${guestCount}`;
    }
    console.log(guestInputField);

    let priceAPIData = {"hotels":[]};
    let count = 0;
    const waitDelay = 2000; //wait 1 second before trying again

    while (priceAPIData.hotels.length === 0)
    {
        if (count > 3){
            break;
        }

        const response2 = await fetch(`https://hotelapi.loyalty.dev/api/hotels/prices?destination_id=${destinationId}&checkin=${checkInDate}&checkout=${checkOutDate}&lang=${language}&currency=${currency}&country_code=SG&guests=${guestCount}&partner_id=1`,{
            method: "GET",
        });
        priceAPIData = await response2.json(); //Results from Price API

        if(priceAPIData.hotels.length > 0){
            break;
        }

        await new Promise(resolve=>setTimeout(resolve, waitDelay));

        count += 1;
    }

    if (priceAPIData.hotels.length === 0){
        console.error("Unable to get prices at the moment, fetching other details...");
        hotelDataDTOClassList.setPriceDataUnavailable(true);
        res.json(destAPIData);
        return;
    }

    compiledData = stitchHotelJsonData(priceAPIData, destAPIData);

    for(let i = 0; i < compiledData.length; i++){
        dataForSingleHotel = transferSingleHotelJSONToClass(compiledData[i]);
        hotelDataDTOClassList.addHotelDataDTO(dataForSingleHotel);
        console.log(`added: ${i}`);
    }
    console.log("finished");
    res.send("Added Hotel Data to DTO Class");
    return;
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
    const hotelId = req.body.hotel_id;
    const destinationId = req.body.destination_id;
    const checkInDate = req.body.check_in_date;
    const checkOutDate = req.body.check_out_date;
    const language = req.body.language; //Default is en_US
    const currency = req.body.currency; //Default is SGD / USD
    const countryCode = req.body.country_code;
    const guestCount = req.body.guest_count;


    let result = {"rooms":[]}
    let count = 0;
    const waitDelay = 2000;

    while(result.rooms.length === 0){
        
        if (count > 3){
            res.send("Unable to retrieve data, check for errors in request parameters.");
            break;
        }

        const response = await fetch(`https://hotelapi.loyalty.dev/api/hotels/${hotelId}/price?destination_id=${destinationId}&checkin=${checkInDate}&checkout=${checkOutDate}&lang=${language}&currency=${currency}&country_code=${countryCode}&guests=${guestCount}&partner_id=1`,{
            method: "GET",
        });

        result = await response.json();
        
        if(result.rooms.length > 0){
            break;
        }

        await new Promise(resolve=>setTimeout(resolve,waitDelay));

        count += 1;
    }
    res.json(result);
});



const options = {
    threshold: 0.8, //the higher the threshold the stricter the search, returning more similar results but also less variations.
    useExtendedSearch: true,
    caseSensitive:false
};


//Router to generate search suggestions based off database destinaton entries.
router.post('/string/', async function(req, res, next){
    const searchString = req.body.searchString;
    allDestinationNames = await destinationModel.findAllDestinations();
    const fuse = new Fuse(allDestinationNames, options);
    result = fuse.search(searchString, {limit:10});
    if (result.length === 0){
        res.send("No available results");
        return;
    }

    res.send(result);
    console.log(hotel1.address);

    
});


router.get("/hotels/images", async function(req, res, next){
    if(!compiledData){
        res.send("No hotel data at the moment, call /search/ to get data...");
        return;
    }

    // let hotelImages = []

    // for(let i = 0; i < compiledData.length; i++){
    //     hotelImageData = {"hotel name":compiledData[i].id, "images":[]}
    //     for(let k = 0; k < compiledData[i].image_details.count; k++){
    //         imageLink = `${compiledData[i].image_details.prefix}${k}${compiledData[i].image_details.suffix}`;
    //         hotelImageData.images.push(imageLink);  
    //     }
    //     hotelImages.push(hotelImageData);
    // }

    // res.send(hotelImages);

    let hotelImages = []
    listHotelDatas = hotelDataDTOClassList.getListHotels();

    for(let i = 0; i < listHotelDatas.length; i ++){
        hotelImageCollage = {"id":listHotelDatas[i].getKeyDetails().id, "images":listHotelDatas[i].getImageDetails().stitchedImageUrls}
        hotelImages.push(hotelImageCollage);
    }
    res.send(hotelImages);
});

module.exports={router: router, HotelDataDTOClassList: hotelDataDTOClassList} //export the hotelDTOClassList OBJECT, not the class itself. The object has all of the initialized fields.