var express = require('express');
const fs = require('fs');
var destinationModel = require('../models/destinations');
var compiledData;
var router = express.Router();

const Fuse = require('fuse.js'); //use this library to generate search suggestions and autocomplete in < 1s.

var hotelDataTransferServiceModule = require('../hotel_data/hotel_data_service');

var filledHotelDTOClassList = hotelDataTransferServiceModule.hotelDataDTOClassList;
 


// |Main route:                                                                                        |
// |Displaying List of Hotels with Prices for given duration of stay, destination and number of guests.|

router.post('/', async function(req, res, next){ 

    //Required Request Body Parameters:
    const destination = req.body.destination_name;
    const checkInDate = req.body.check_in_date;
    const checkOutDate = req.body.check_out_date;
    const guestCount = req.body.guest_count;
    const roomCount = req.body.room_count;

    await hotelDataTransferServiceModule.getAllHotelsAndPricesForDestination(destination, checkInDate, checkOutDate, guestCount, roomCount);

    res.send(filledHotelDTOClassList.getListHotels()); //JSON output seen in POSTMAN

    return;
});

//TODO:
//Based on all of the hotel DTO class data we have initialised with the single '/' API call, let us now create all the different endpoints that can query from these classes 
//Specific data, so that we can then pass this data to the middleware.

router.post('/MainDisplay', async function(req, res, next) { 
    const destination = req.body.destination_name;
    const checkInDate = req.body.check_in_date;
    const checkOutDate = req.body.check_out_date;
    const guestCount = req.body.guest_count;
    const roomCount = req.body.room_count;
    
    

    await hotelDataTransferServiceModule.getAllHotelsAndPricesForDestination(
        destination, checkInDate, checkOutDate, guestCount, roomCount
    );

    const hotelList = filledHotelDTOClassList.getListHotels();

    // Filter to only name, rating, address
    const filteredHotelList = hotelList.map(hotel => ({
        name: hotel.getKeyDetails().name || "N/A",
        rating: hotel.getKeyDetails().rating || "N/A",
        address: hotel.getKeyDetails().address || hotel.getKeyDetails().address1 || "N/A"
    }));
    const sortList = sortByRatings(filteredHotelList);
    res.send(sortList);
    // res.send(filteredHotelList);
    return;
});

/*getting the all the images of a hotel endpoint*/
router.get('/images/',async function (req,res,next){
    let imageList = []; 
    let id_with_images = {};

    let hotelData = filledHotelDTOClassList.getListHotels();

    let hotel_id =  hotelData.map(id => id.getKeyDetails().id) //returns array of hotel id
    let imageDetails = hotelData.map(fullData => fullData.getImageDetails());
    let imageURLs = imageDetails.map(image => image.stitchedImageUrls);

    for (let count in imageDetails){
        imageList.push(imageDetails[count].stitchedImageUrls);
    }

    //loop through each element of array (hotel_id) then assign each key(id) with value(element in imagelist)
    hotel_id.forEach((id,images_index)=>{ 
        id_with_images[id] = imageList[images_index] 
    });

    /*will get all the hotel and their respective hotel image URLS 
    eg. {StY1 : ["URL0","URL1"], g6Ui :["URL0"], ...}*/
    res.send(id_with_images); 
});


/*Helper function*/

function sortByRatings(hotels,order = "asc"){

    if (order === "desc"){
        return 0;
    }
    else if (order === "asc"){
        hotels.sort((a,b)=>{
            //take all values of the object
            const aVal = Object.values(a);
            const bVal = Object.values(b);

            //sort the array of values
            const aSorted = aVal.sort();
            const bSorted = bVal.sort();

            //turn to json strings for comparison
            const aValue = JSON.stringify(aSorted);
            const bValue = JSON.stringify(bSorted);

            if (aValue < bValue){
                return -1;
            }
            if (aValue > bValue){
                return 1;
            }
            return 0 
        });    
    }
}

















// |Other Routes Calling Different Ascenda/Library API----------------------------------------------------------------------------------------------|


//Get info for a single hotel, returning the same fields as the API listing hotels for a particular destination
router.get('/hotel/:hotel_id', async function (req, res, next) {
    let hotelId = req.params.hotel_id
    console.log(hotelId);

    result = await hotelDataTransferServiceModule.getSingleHotelDetailsWithoutPrice();
    res.json(result);
})

//Get the room pricings for a specific hotel, at a specific destination
router.post('/hotel/prices', async function(req, res, next){
    const hotelId = req.body.hotel_id;
    const destinationId = req.body.destination_id;
    const checkInDate = req.body.check_in_date;
    const checkOutDate = req.body.check_out_date;
    const guestCount = req.body.guest_count;
    const roomCount = req.body.room_count;

    result = await hotelDataTransferServiceModule.getSingleHotelPriceDetails(hotelId, destinationId, checkInDate, checkOutDate, guestCount, roomCount);
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

    let hotelImages = []
    listHotelDatas = filledHotelDTOClassList.getListHotels();

    for(let i = 0; i < listHotelDatas.length; i ++){
        hotelImageCollage = {"id":listHotelDatas[i].getKeyDetails().id, "images":listHotelDatas[i].getImageDetails().stitchedImageUrls}
        hotelImages.push(hotelImageCollage);
    }
    res.send(hotelImages);
});

module.exports=router