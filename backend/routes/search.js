var express = require("express");
const fs = require("fs");
var destinationModel = require("../models/destinations");
var compiledData;
var router = express.Router();

const Fuse = require("fuse.js"); //use this library to generate search suggestions and autocomplete in < 1s.

var hotelDataTransferServiceModule = require("../hotel_data/hotel_data_service");

var filledHotelDTOClassList =
  hotelDataTransferServiceModule.hotelDataDTOClassList;

var hotelRoomDataTransferServiceModule = require("../hotel_data/hotel_room_data_service");
var filledHotelRoomDataDTOClassList =
  hotelRoomDataTransferServiceModule.hotelRoomDataDTOClassList;

var date_regex = /^\d{4}-\d{2}-\d{2}$/;

// |Main route:                                                                                        |
// |Displaying List of Hotels with Prices for given duration of stay, destination and number of guests.|

router.get(
  "/:destination_name/:check_in_date/:check_out_date/:guest_count/:room_count",
  async function (req, res, next) {
    if (
      process.env.NODE_ENV === "test" &&
      !(process.env.INTEGRATION_TEST === "true")
    ) {
      res
        .status(200)
        .json("Hello from the backend, running main search endpoint now");
      return;
    }

    try {
      //Required Request Body Parameters:
      const destination = req.params.destination_name.replace("_", " ");
      const checkInDate = req.params.check_in_date;
      const checkOutDate = req.params.check_out_date;
      const guestCount = req.params.guest_count;
      const roomCount = req.params.room_count;

      console.log("checkin" + checkInDate);

      //check the input fields
      if (
        !checkInDate ||
        !date_regex.test(checkInDate) ||
        !checkOutDate ||
        !date_regex.test(checkOutDate)
      ) {
        console.log("invalid checkin");
        return res.status(400).json("Invalid check-in/out date");
      }

      //Now, check if check in date is before checkout date
      yearMonthDaysCheckIn = checkInDate.split("-");
      yearMonthDaysCheckOut = checkOutDate.split("-");

      let isLess = true;
      for (let i = 0; i < 3; i++) {
        if (
          Number(yearMonthDaysCheckIn[i]) > Number(yearMonthDaysCheckOut[i])
        ) {
          isLess = false;
        }
      }

      if (isLess === false) {
        console.log("invalid checkin date too high");
        return res.status(400).json("Check in date is greater than checkout");
      }

      if (
        !guestCount ||
        !isNaN(guestCount) === false ||
        !roomCount ||
        !isNaN(roomCount) === false
      ) {
        //unable to coerce to number
        console.log("invalid guest room count");
        return res.status(400).json("Invalid guest/room count data types.");
      }

      //set the initialized variable to false everytime, because when we call this endpoint the goal is to initlialize all fields in the DTO, for every single time we search a new destination

      //Await a response from all the API calls and rudimentarily the Ascenda Server. If no data retrieved then log as HTTP 400 Server error.
      try {
        await hotelDataTransferServiceModule.getAllHotelsAndPricesForDestination(
          destination,
          checkInDate,
          checkOutDate,
          guestCount,
          roomCount
        );

        if (filledHotelDTOClassList.getIsEmpty() === true) {
          console.log("here");
          filledHotelDTOClassList.setIsEmpty(false);
          res.status(400).send("Internal Server Error");
        } else {
          console.log("sending!!!");
          res.status(200).send({
            hotelList: filledHotelDTOClassList.getListHotels(),
            destination_id: filledHotelDTOClassList.getCurrentDestinationId(),
          }); //JSON output seen in POSTMAN
        }
      } catch (error) {
        res.status(400).json(error + "Internal Server Error");
      }

      return;
    } catch (error) {
      res.status(400).json("Bad Request");
    }
  }
);

//TODO:
//Based on all of the hotel DTO class data we have initialised with the single '/' API call, let us now create all the different endpoints that can query from these classes
//Specific data, so that we can then pass this data to the middleware.

//Endpoint to Display Thumbnail Info of Hotels
router.get(
  "/MainDisplay/:destination_name/:check_in_date/:check_out_date/:guest_count/:room_count",
  async function (req, res, next) {
    if (
      process.env.NODE_ENV === "test" &&
      !(process.env.INTEGRATION_TEST === "true")
    ) {
      res
        .status(200)
        .json(
          "Hello from the backend, running search/MainDisplay endpoint now"
        );
      return;
    }

    try {
      const destination = req.params.destination_name.replace("_", " ");
      const checkInDate = req.params.check_in_date;
      const checkOutDate = req.params.check_out_date;
      const guestCount = req.params.guest_count;
      const roomCount = req.params.room_count;

      //check the input fields

      if (
        !checkInDate ||
        !date_regex.test(checkInDate) ||
        !checkOutDate ||
        !date_regex.test(checkOutDate)
      ) {
        return res.status(400).json("Invalid check-in/out date");
      }

      //Now, check if check in date is before checkout date
      yearMonthDaysCheckIn = checkInDate.split("-");
      yearMonthDaysCheckOut = checkOutDate.split("-");

      let isLess = true;
      for (let i = 0; i < 3; i++) {
        if (
          Number(yearMonthDaysCheckIn[i]) > Number(yearMonthDaysCheckOut[i])
        ) {
          isLess = false;
        }
      }

      if (isLess === false) {
        return res.status(400).json("Check in date is greater than checkout");
      }

      if (
        !guestCount ||
        !isNaN(guestCount) === false ||
        !roomCount ||
        !isNaN(roomCount) === false
      ) {
        //unable to coerce to number
        return res.status(400).json("Invalid guest/room count data types.");
      }

      try {
        await hotelDataTransferServiceModule.getAllHotelsAndPricesForDestination(
          destination,
          checkInDate,
          checkOutDate,
          guestCount,
          roomCount
        );

        const hotelList = filledHotelDTOClassList.getListHotels();

        // Filter to only name, rating, address
        const filteredHotelList = hotelList.map((hotel) => ({
          name: hotel.keyDetails.name || "N/A",
          rating: hotel.keyDetails.rating || "N/A",
          address:
            hotel.keyDetails.address || hotel.keyDetails.address1 || "N/A",
        }));

        res.send(filteredHotelList);
        return;
      } catch (error) {
        res.status(400).json(error + "Internal Server Error");
      }
    } catch (error) {
      res.status(400).json("Bad Request");
    }
  }
);

//Endpoint to More Detailed Info of Hotels
router.get(
  "/AdvancedDisplay/:destination_name/:check_in_date/:check_out_date/:guest_count/:room_count",
  async function (req, res, next) {
    if (
      process.env.NODE_ENV === "test" &&
      !(process.env.INTEGRATION_TEST === "true")
    ) {
      res
        .status(200)
        .json(
          "Hello from the backend, running search/AdvancedDisplay endpoint now"
        );
      return;
    }

    try {
      const destination = req.params.destination_name.replace("_", " ");
      const checkInDate = req.params.check_in_date;
      const checkOutDate = req.params.check_out_date;
      const guestCount = req.params.guest_count;
      const roomCount = req.params.room_count;

      //check the input fields

      if (
        !checkInDate ||
        !date_regex.test(checkInDate) ||
        !checkOutDate ||
        !date_regex.test(checkOutDate)
      ) {
        console.log("invalid checkin");
        return res.status(400).json("Invalid check-in/out date");
      }

      //Now, check if check in date is before checkout date
      yearMonthDaysCheckIn = checkInDate.split("-");
      yearMonthDaysCheckOut = checkOutDate.split("-");

      let isLess = true;
      for (let i = 0; i < 3; i++) {
        if (
          Number(yearMonthDaysCheckIn[i]) > Number(yearMonthDaysCheckOut[i])
        ) {
          isLess = false;
        }
      }

      if (isLess === false) {
        return res.status(400).json("Check in date is greater than checkout");
      }

      if (
        !guestCount ||
        !isNaN(guestCount) === false ||
        !roomCount ||
        !isNaN(roomCount) === false
      ) {
        //unable to coerce to number
        console.log("invalid guest count");
        return res.status(400).json("Invalid guest/room count data types.");
      }

      try {
        await hotelDataTransferServiceModule.getAllHotelsAndPricesForDestination(
          destination,
          checkInDate,
          checkOutDate,
          guestCount,
          roomCount
        );

        const hotelList = filledHotelDTOClassList.getListHotels();

        const filteredHotelList = hotelList.map((hotel) => {
          const keyDetails = hotel.keyDetails || hotel.getKeyDetails?.() || {};
          const amenities =
            hotel.amenities && hotel.amenities.amenities
              ? hotel.amenities.amenities
              : {};
          const trustYouScores =
            hotel.trustYouBenchmark &&
            hotel.trustYouBenchmark.score &&
            hotel.trustYouBenchmark.score.score
              ? hotel.trustYouBenchmark.score.score
              : {};
          const price =
            hotel.pricingRankingData && hotel.pricingRankingData.price
              ? hotel.pricingRankingData.price
              : "N/A";

          return {
            name: keyDetails.name || "N/A",
            address: keyDetails.address || keyDetails.address1 || "N/A",
            rating: keyDetails.rating || "N/A",
            description: keyDetails.description || "N/A",
            check_in_time: keyDetails.checkinTime || "N/A",
            amenities: amenities,
            scores: {
              overall: trustYouScores.overall ?? "N/A",
              kaligo_overall: trustYouScores.kaligo_overall ?? "N/A",
              solo: trustYouScores.solo ?? "N/A",
              couple: trustYouScores.couple ?? "N/A",
              family: trustYouScores.family ?? "N/A",
              business: trustYouScores.business ?? "N/A",
            },
            price: price,
          };
        });

        res.json(filteredHotelList);
        return;
      } catch (error) {
        res.status(400).json(error + "Internal Server Error");
      }
      return;
    } catch (error) {
      res.status(400).json("Bad request");
    }
  }
);

/*getting the all the images of a hotel endpoint*/
router.get("/images/", async function (req, res, next) {
  if (
    process.env.NODE_ENV === "test" &&
    !(process.env.INTEGRATION_TEST === "true")
  ) {
    res
      .status(200)
      .json("Hello from the backend, running search/images endpoint now");
    return;
  }

  let imageList = [];
  let id_with_images = {};

  let hotelData = filledHotelDTOClassList.getListHotels();

  let hotel_id = hotelData.map((id) => id.getKeyDetails().id); //returns array of hotel id
  let imageDetails = hotelData.map((fullData) => fullData.getImageDetails());
  let imageURLs = imageDetails.map((image) => image.stitchedImageUrls);

  for (let count in imageDetails) {
    imageList.push(imageDetails[count].stitchedImageUrls);
  }

  //loop through each element of array (hotel_id) then assign each key(id) with value(element in imagelist)
  hotel_id.forEach((id, images_index) => {
    id_with_images[id] = imageList[images_index];
  });

  /*will get all the hotel and their respective hotel image URLS 
    eg. {StY1 : ["URL0","URL1"], g6Ui :["URL0"], ...}*/
  res.send(id_with_images);
});

// |Other Routes Calling Different Ascenda/Library API----------------------------------------------------------------------------------------------|

//Get info for a single hotel, returning the same fields as the API listing hotels for a particular destination
router.get("/hotel/:hotel_id", async function (req, res, next) {
  if (
    process.env.NODE_ENV === "test" &&
    !(process.env.INTEGRATION_TEST === "true")
  ) {
    res
      .status(200)
      .json(
        "Hello from the backend, running search/hotel/hotel_id endpoint now"
      );
    return;
  }
  try {
    const hotelId = req.params.hotel_id;

    const result =
      await hotelRoomDataTransferServiceModule.getSingleHotelDetailsWithoutPrice(
        hotelId
      );

    res.json(result);
  } catch (error) {
    res.status(400).json("Bad Request");
  }
});

//Get the room pricings for a specific hotel, at a specific destination
router.get(
  "/hotel/prices/:hotel_id/:destination_id/:check_in_date/:check_out_date/:guest_count/:room_count",
  async function (req, res, next) {
    if (
      process.env.NODE_ENV === "test" &&
      !(process.env.INTEGRATION_TEST === "true")
    ) {
      res
        .status(200)
        .json(
          "Hello from the backend, running search/hotel/prices endpoint now"
        );
      return;
    }

    try {
      const hotelId = req.params.hotel_id;
      const destinationId = req.params.destination_id;
      const checkInDate = req.params.check_in_date;
      const checkOutDate = req.params.check_out_date;
      const guestCount = req.params.guest_count;
      const roomCount = req.params.room_count;

      //check the input fields
      if (
        !checkInDate ||
        !date_regex.test(checkInDate) ||
        !checkOutDate ||
        !date_regex.test(checkOutDate)
      ) {
        return res.status(400).send("Invalid checkin checkout");
      }

      //Now, check if check in date is before checkout date
      yearMonthDaysCheckIn = checkInDate.split("-");
      yearMonthDaysCheckOut = checkOutDate.split("-");

      let isLess = true;
      for (let i = 0; i < 3; i++) {
        if (
          Number(yearMonthDaysCheckIn[i]) > Number(yearMonthDaysCheckOut[i])
        ) {
          isLess = false;
        }
      }

      if (isLess === false) {
        return res.status(400).json("Check in date is greater than checkout");
      }

      if (
        !guestCount ||
        !isNaN(guestCount) === false ||
        !roomCount ||
        !isNaN(roomCount) === false
      ) {
        //unable to coerce to number
        return res.status(400).json("Invalid guest/room count data types.");
      }

      const result =
        await hotelRoomDataTransferServiceModule.getSingleHotelPriceDetails(
          hotelId,
          destinationId,
          checkInDate,
          checkOutDate,
          guestCount,
          roomCount
        );

      if (result === -1) {
        //No rooms were avaialable, hence return an error 400.
        res.status(400).send("Server Error, unable to retrieve rooms");
        return;
      }

      res.status(200).send(filledHotelRoomDataDTOClassList.getListHotelRooms());
      return;
    } catch (error) {
      res.status(400).json("Bad Request");
    }
  }
);

const options = {
  threshold: 0.8, //the higher the threshold the stricter the search, returning more similar results but also less variations.
  useExtendedSearch: true,
  caseSensitive: false,
};

//Router to generate search suggestions based off database destinaton entries.
router.get("/string/:searchLiteral", async function (req, res, next) {
  if (
    process.env.NODE_ENV === "test" &&
    !(process.env.INTEGRATION_TEST === "true")
  ) {
    res
      .status(200)
      .json("Hello from the backend, running search/string/ endpoint now");
    return;
  }

  const searchString = req.params.searchLiteral;

  const regexFormat =
    /^([A-Za-z]{2,}(?: [A-Za-z]{2,})*)(?: ?, ([A-Za-z]{2,}(?: [A-Za-z]{2,})*))*$/;

  if (!searchString || !regexFormat.test(searchString)) {
    return res.status(400).json("Invalid search format");
  }

  try {
    const allDestinationNames = await destinationModel.findAllDestinations();
    const fuse = new Fuse(allDestinationNames, options);
    const result = await fuse.search(searchString, { limit: 10 });

    if (!result) {
      return res.status(400).json("Bad Search Request");
    }

    res.send(result);
  } catch (err) {
    console.error("Error during /search/string/:searchLiteral:", err);
    res.status(400).json("Error processing search");
  }
});

router.get("/hotels/images", async function (req, res, next) {
  if (
    process.env.NODE_ENV === "test" &&
    !(process.env.INTEGRATION_TEST === "true")
  ) {
    res
      .status(200)
      .json(
        "Hello from the backend, running search/hotels/images endpoint now"
      );
    return;
  }

  let hotelImages = [];
  listHotelDatas = filledHotelDTOClassList.getListHotels();

  for (let i = 0; i < listHotelDatas.length; i++) {
    hotelImageCollage = {
      id: listHotelDatas[i].getKeyDetails().id,
      images: listHotelDatas[i].getImageDetails().getStitchedImageUrls(),
    };
    hotelImages.push(hotelImageCollage);
  }
  res.send(hotelImages);
});

module.exports = router;
