var hotelDataDTO = require("../hotel_data/hotel_data_DTO");
var jsonData = require("../hotelresources/destinations.json");
const express = require("express");

class HotelDataTransferService {
  constructor(jsonData) {
    this.keyDetails = null;
    this.iTrustYouBenchmark = null;
    this.imageDetails = null;
    this.pricingRankingData = null;
    this.amenities = null;
    this.originalMetaData = null;
    this.jsonData = jsonData;
  }

  transferKeyDetails() {
    this.keyDetails = new hotelDataDTO.KeyDetails.Builder()
      .setId(this.jsonData.id)
      .setImageCount(this.jsonData.imageCount)
      .setLatitude(this.jsonData.latitude)
      .setLongitude(this.jsonData.longitude)
      .setName(this.jsonData.name)
      .setAddress(this.jsonData.address)
      .setAddress1(this.jsonData.address1)
      .setRating(this.jsonData.rating)
      .setDistance(this.jsonData.distance)
      .setCheckinTime(this.jsonData.checkin_time)
      .setDescription(this.jsonData.description)
      .build();

    return this;
  }

  transferITrustYouScore() {
    this.iTrustYouBenchmark = new hotelDataDTO.TrustYouBenchmark.Builder()
      .setTrustYouId(this.jsonData.trustyou.id)
      .setTrustYouScoreParameters(this.jsonData.trustyou)
      .build();

    return this;
  }

  transferImageDetails() {
    this.imageDetails = new hotelDataDTO.ImageDetails.Builder()
      .setImageCounts(this.jsonData.hires_image_index)
      .setImageUrlPrefix(this.jsonData.image_details.prefix)
      .setImageUrlSuffix(this.jsonData.image_details.suffix)
      .stitchImageUrls()
      .build();

    return this;
  }

  transferPricingRankingData() {
    this.pricingRankingData = new hotelDataDTO.PricingRankingData.Builder()
      .setRank(this.jsonData.rank)
      .setSearchRank(this.jsonData.searchRank)
      .setPriceType(this.jsonData.price_type)
      .setFreeCancellation(this.jsonData.free_cancellation)
      .setRoomsAvailable(this.jsonData.rooms_available)
      .setMaxCashPayment(this.jsonData.max_cash_payment)
      .setPoints(this.jsonData.points)
      .setBonuses(this.jsonData.bonuses)
      .setBonusTiers(this.jsonData.bonus_tiers)
      .setLowestPrice(this.jsonData.lowest_price)
      .setPrice(this.jsonData.price)
      .setConvertedPrice(this.jsonData.converted_price)
      .setLowestConvertedPrice(this.jsonData.lowest_converted_price)
      .setMarketRates(this.jsonData.market_rates)
      .build();

    return this;
  }

  transferAmenitiesData() {
    this.amenities = new hotelDataDTO.Amenities.Builder()
      .setAmenities(this.jsonData.amenities)
      .build();

    return this;
  }

  transferOriginalMetaData() {
    this.originalMetaData = new hotelDataDTO.OriginalMetaData.Builder()
      .setName(this.jsonData.name)
      .setCity(this.jsonData.city)
      .setState(this.jsonData.state)
      .setCountry(this.jsonData.country)
      .build();

    return this;
  }

  getNewHotelDataDTOClass() {
    return new hotelDataDTO.HotelData(
      this.keyDetails,
      this.amenities,
      this.imageDetails,
      this.originalMetaData,
      this.pricingRankingData,
      this.iTrustYouBenchmark
    );
  }
}

class HotelDataDTOClassList {
  constructor() {
    this.hotelDataDTOs = [];
    this.bPriceDataUnavailable = false;
    this.emptyData = false;
    this.currentSearchDestinationName = null;
    this.currentSearchDestinationId = null;
    this.currentGuestCount = null;
    this.currentRoomCount = null;
    this.currentCheckIn = null;
    this.currentCheckOut = null;
  }
  addHotelDataDTO(hotelDataDTO) {
    this.hotelDataDTOs.push(hotelDataDTO);
  }

  getListHotels() {
    return this.hotelDataDTOs;
  }

  setPriceDataUnavailable(bUnavailable) {
    this.bPriceDataUnavailable = bUnavailable;
  }

  getIsPriceDataUnavailable() {
    return this.bPriceDataUnavailable;
  }

  setIsEmpty(bIsEmpty) {
    this.emptyData = bIsEmpty;
  }

  getIsEmpty() {
    return this.emptyData;
  }

  setCurrentSearchDestinationName(destName) {
    this.currentSearchDestinationName = destName;
  }

  setCurrentGuestCount(guestCount) {
    this.currentGuestCount = guestCount;
  }

  setCurrentRoomCount(roomCount) {
    this.currentRoomCount = roomCount;
  }

  setCurrentCheckIn(checkIn) {
    this.currentCheckIn = checkIn;
  }

  setCurrentCheckOut(checkOut) {
    this.currentCheckOut = checkOut;
  }

  getCurrentDestinationName() {
    return this.currentSearchDestinationName;
  }

  setCurrentSearchDestinationId(destId) {
    this.currentSearchDestinationId = destId;
  }

  getCurrentDestinationId() {
    return this.currentSearchDestinationId;
  }

  getCurrentGuestCount() {
    return this.currentGuestCount;
  }

  getCurrentRoomCount() {
    return this.currentRoomCount;
  }

  getCurrentCheckIn() {
    return this.currentCheckIn;
  }

  getCurrentCheckOut() {
    return this.currentCheckOut;
  }

  resetHotelDTOList() {
    this.hotelDataDTOs = [];
  }
}

var hotelDataDTOClassList = new HotelDataDTOClassList(); //Declare with Global Scope

// |Helper Functions Start--------------------------------------------------------------------------------|

async function getHotelID(term, jsonData) {
  if (term.length < 4) {
    return -1;
  }
  for (let symbol of "! @ # % ^ & * ( ) _ + } | : ? > < ~ / ] [ ; : . - = \\".split()) {
    if (term.includes(symbol)) {
      return -1;
    }
  }

  if (!/[a-zA-Z]/.test(term)) {
    return -1;
  }

  let destination = jsonData.find((item) => item.term == term);
  if (destination) {
    let uid = destination.uid;
    return uid;
  } else {
    return "-1";
  }
}

function stitchHotelJsonData(hotelPricingData, hotelDataFromDest) {
  hotels = hotelPricingData.hotels;
  if (!hotels) {
    console.log("Cannot find prices...");
    return hotelDataFromDest;
  }

  finalHotelsDetails = [];
  for (let i = 0; i < hotels.length; i++) {
    hotelId = hotels[i].id;
    for (let k = 0; k < hotelDataFromDest.length; k++) {
      if (hotelId === hotelDataFromDest[k].id) {
        compiledHotelData = Object.assign(hotelDataFromDest[k], hotels[i]);
        finalHotelsDetails.push(compiledHotelData);
      }
    }
  }

  return finalHotelsDetails;
}

function transferSingleHotelJSONToClass(jsonData) {
  hotelDataTransferService = new HotelDataTransferService(jsonData);
  if (hotelDataDTOClassList.getIsPriceDataUnavailable() === true) {
    singleHotelDataDTO = hotelDataTransferService
      .transferKeyDetails()
      .transferImageDetails()
      .transferITrustYouScore()
      .transferAmenitiesData()
      .transferOriginalMetaData()
      .getNewHotelDataDTOClass();
    hotelDataDTOClassList.setPriceDataUnavailable(false);
  } else {
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

async function getAllHotelsAndPricesForDestination(
  destination_name,
  check_in,
  check_out,
  guest_count,
  room_count
) {
  //We do an initial check here to avoid calling the API repeatedly. If we have already initialized our data for the same current destination, then leave it.
  if (
    hotelDataDTOClassList.getCurrentDestinationName() === destination_name &&
    hotelDataDTOClassList.getCurrentCheckIn() === check_in &&
    hotelDataDTOClassList.getCurrentCheckOut() === check_out &&
    hotelDataDTOClassList.getCurrentRoomCount() === room_count &&
    hotelDataDTOClassList.getCurrentGuestCount() === guest_count
  ) {
    console.log("Data has already been initialised");
    return 0;
  }

  const data = jsonData; //Bring over main json data file

  if (!data) {
    console.log("unable to load json data");
    return -1;
  }
  let destinationId = await getHotelID(destination_name, jsonData);
  if (destinationId === "-1") {
    console.log("destination not found");
    return -1;
  }

  const response = await fetch(
    `https://hotelapi.loyalty.dev/api/hotels?destination_id=${destinationId}`,
    {
      method: "GET",
    }
  );
  destAPIData = await response.json(); //Results from Dest API

  if (Array.isArray(destAPIData) && destAPIData.length === 0) {
    hotelDataDTOClassList.setIsEmpty(true);
    console.log("Unable to retrieve data from given destination.");
    return -1;
  }

  guestInputField = `${guest_count}`;
  for (let i = 1; i < room_count; i++) {
    guestInputField += `|${guest_count}`;
  }

  let priceAPIData = { hotels: [] };
  let count = 0;
  const waitDelay = 2000; //wait 1 second before trying again

  while (priceAPIData.hotels.length === 0) {
    if (count > 3) {
      break;
    }

    const response2 = await fetch(
      `https://hotelapi.loyalty.dev/api/hotels/prices?destination_id=${destinationId}&checkin=${check_in}&checkout=${check_out}&lang=en_US&currency=SGD&country_code=SG&guests=${guestInputField}&partner_id=1089&landing_page=wl-acme-earn&product_type=earn`,
      {
        method: "GET",
      }
    );
    priceAPIData = await response2.json(); //Results from Price API

    if (priceAPIData.hotels.length > 0) {
      break;
    }

    await new Promise((resolve) => setTimeout(resolve, waitDelay));

    count += 1;
  }

  if (priceAPIData.hotels.length === 0) {
    console.log(
      "Unable to get prices at the moment, fetching other details..."
    );
    hotelDataDTOClassList.setPriceDataUnavailable(true);
    compiledData = destAPIData;
  } else {
    compiledData = stitchHotelJsonData(priceAPIData, destAPIData);
  }

  hotelDataDTOClassList.resetHotelDTOList();
  //reset to clear pass data, cus this code block will only call for a novel destination not searched yet.

  for (let i = 0; i < compiledData.length; i++) {
    dataForSingleHotel = transferSingleHotelJSONToClass(compiledData[i]);
    hotelDataDTOClassList.addHotelDataDTO(dataForSingleHotel);
  }

  // console.log("finished");
  hotelDataDTOClassList.setCurrentSearchDestinationName(destination_name);
  hotelDataDTOClassList.setCurrentSearchDestinationId(destinationId);
  hotelDataDTOClassList.setCurrentCheckIn(check_in);
  hotelDataDTOClassList.setCurrentCheckOut(check_out);
  hotelDataDTOClassList.setCurrentGuestCount(guest_count);
  hotelDataDTOClassList.setCurrentRoomCount(room_count);
  //SAVE the current destination name we are searching for, as the subject of our DTO class.
  //That way, when we call a search for new destination through any of the endpoints the code will know when to reach back
  //to Ascenda API to get results for a new destination or not.
  console.log("DTO classes have been initialised");
  return 0;
}

async function getSingleHotelPriceDetails(
  hotelId,
  destinationId,
  checkInDate,
  checkOutDate,
  guestCount,
  roomCount
) {
  let result = { rooms: [] };
  let count = 0;
  const waitDelay = 2000;

  while (result.rooms.length === 0) {
    if (count > 3) {
      console.log(
        "Unable to retrieve data, check for errors in request parameters."
      );
      break;
    }

    guestInputField = `${guestCount}`;
    for (let i = 1; i < roomCount; i++) {
      guestInputField += `|${guestCount}`;
    }

    const response = await fetch(
      `https://hotelapi.loyalty.dev/api/hotels/${hotelId}/price?destination_id=${destinationId}&checkin=${checkInDate}&checkout=${checkOutDate}&lang=en_US&currency=SGD&country_code=SG&guests=${guestInputField}&partner_id=1089&landing_page=wl-acme-earn&product_type=earn`,
      {
        method: "GET",
      }
    );

    result = await response.json();

    if (result.rooms.length > 0) {
      break;
    }

    await new Promise((resolve) => setTimeout(resolve, waitDelay));

    count += 1;
  }
  return result;
}

async function getSingleHotelDetailsWithoutPrice(hotelId) {
  const response = await fetch(
    `https://hotelapi.loyalty.dev/api/hotels/${hotelId}`,
    {
      method: "GET",
    }
  );

  const result = await response.json();
  return result;
}

module.exports = {
  hotelDataDTOClassList,
  getAllHotelsAndPricesForDestination,
  getSingleHotelPriceDetails,
  getSingleHotelDetailsWithoutPrice,
  HotelDataTransferService,
};
