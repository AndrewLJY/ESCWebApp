const hotelRoomDTO = require("../hotel_data/hotel_room_data_DTO");

class HotelRoomDataTransferService {
  constructor(jsonData) {
    this.keyRoomDetails = null;
    this.priceDetails = null;
    this.taxDetails = null;
    this.roomAdditionalInfo = null;
    this.jsonData = jsonData;
  }

  transferKeyRoomDetails() {
    console.log(
      "-------------------------------------------------------------------------------------------------"
    );
    console.log(this.jsonData);
    this.keyRoomDetails = new hotelRoomDTO.KeyRoomDetails.Builder()
      .setKeyId(this.jsonData.key)
      .setRoomDescription(this.jsonData.roomDescription)
      .setRoomNormalisedDescription(this.jsonData.roomNormalizedDescription)
      .setRoomTypeIndex(this.jsonData.type)
      .setFreeCancellation(this.jsonData.free_cancellation)
      .setLongDescription(this.jsonData.long_description)
      .setRoomImages(this.jsonData.images)
      .build();

    return this;
  }

  transferPriceDetails() {
    this.priceDetails = new hotelRoomDTO.PriceDetails.Builder()
      .setDescription(this.jsonData.description)
      .setPriceType(this.jsonData.price_type)
      .setMaxCashPayment(this.jsonData.max_cash_payment)
      .setCovertedMaxCashPayment(this.jsonData.coverted_max_cash_payment)
      .setPoints(this.jsonData.points)
      .setBonuses(this.jsonData.bonuses)
      .setBonusPrograms(this.jsonData.bonus_programs)
      .setBonusTiers(this.jsonData.bonus_tiers)
      .setLowestPrice(this.jsonData.lowest_price)
      .setPrice(this.jsonData.price)
      .setConvertedPrice(this.jsonData.converted_price)
      .setLowestConvertedPrice(this.jsonData.lowest_converted_price)
      .setChargeableRate(this.jsonData.chargeableRate)
      .setMarketRates(this.jsonData.market_rates)
      .build();

    return this;
  }

  transferRoomAdditionalInfo() {
    this.roomAdditionalInfo = new hotelRoomDTO.RoomAdditionalInfo.Builder()
      .setBreakfastInfo(this.jsonData.roomAdditionalInfo.breakfastInfo)
      .setSpecialCheckInInstructions(
        this.jsonData.roomAdditionalInfo.displayFields
          .special_check_in_instructions
      )
      .setKnowBeforeYouGo(
        this.jsonData.roomAdditionalInfo.displayFields.know_before_you_go
      )
      .setOptionalFees(
        this.jsonData.roomAdditionalInfo.displayFields.fees_optional
      )
      .setMandatoryFees(
        this.jsonData.roomAdditionalInfo.displayFields.fees_mandatory
      )
      .setKaligoServiceFee(
        this.jsonData.roomAdditionalInfo.displayFields.kaligo_service_fee
      )
      .setHotelFees(this.jsonData.roomAdditionalInfo.displayFields.hotel_fees)
      .setSurcharges(this.jsonData.roomAdditionalInfo.displayFields.surcharges)
      .build();

    return this;
  }

  transferTaxDetails() {
    this.taxDetails = new hotelRoomDTO.TaxDetails.Builder()
      .setBaseRate(this.jsonData.base_rate)
      .setBaseRateInCurrency(this.jsonData.base_rate_in_currency)
      .setIncludedTaxesFeesTotal(this.jsonData.included_taxes_and_fees_total)
      .setIncludedTaxesFeesTotalInCurrency(
        this.jsonData.included_taxes_and_fees_total_in_currency
      )
      .setExcludedTaxesFeesTotal(this.jsonData.excluded_taxes_and_fees_total)
      .setExcludedTaxesFeesTotalInCurrency(
        this.jsonData.excluded_taxes_and_fees_total_in_currency
      )
      .setIncludedTaxesFeesDetails(this.jsonData.included_taxes_and_fees)
      .setIncludedTaxesFeesInCurrencyDetails(
        this.jsonData.included_taxes_and_fees_in_currency
      )
      // .setExcludedTaxesFeesInCurrencyDetails(this.jsonData
      // .setExcludedTaxesFeesDetails(this.jsonData //Not sure if values exist. Need further tests.
      .build();

    return this;
  }

  getNewHotelRoomDataDTOClass() {
    return new hotelRoomDTO.HotelRoomData.Builder()
      .setKeyRoomDetails(this.keyRoomDetails)
      .setPriceDetails(this.priceDetails)
      .setRoomAdditionalInfo(this.roomAdditionalInfo)
      .setTaxDetails(this.taxDetails)
      .build();
  }
}

class HotelRoomDataDTOClassList {
  constructor() {
    this.hotelRoomDataDTOs = [];
  }

  addHotelRoomDataDTO(hotelRoomDataDTOObject) {
    this.hotelRoomDataDTOs.push(hotelRoomDataDTOObject);
  }

  clearHotelRoomDataDTOs() {
    this.hotelRoomDataDTOs = [];
  }

  getListHotelRooms() {
    return this.hotelRoomDataDTOs;
  }
}

var hotelRoomDataDTOClassList = new HotelRoomDataDTOClassList();

function transferSingleRoomDetails(jsonData) {
  try {
    let hotelRoomDataTransferService = new HotelRoomDataTransferService(
      jsonData
    );
    let hotelRoomDTOObject = hotelRoomDataTransferService
      .transferKeyRoomDetails()
      .transferPriceDetails()
      .transferRoomAdditionalInfo()
      .transferTaxDetails()
      .getNewHotelRoomDataDTOClass();
    return hotelRoomDTOObject;
  } catch (error) {
    throw error;
  }
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
    console.log("Trying here...");

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
    //changes made to ascenda's api ~nam
    const response = await fetch(
      `https://hotelapi.loyalty.dev/api/hotels/${hotelId}/price?destination_id=${destinationId}&checkin=${checkInDate}&checkout=${checkOutDate}&lang=en_US&currency=SGD&country_code=SG&guests=${guestInputField}&partner_id=1098&landing_page=wl-acme-earn&product_type=earn`,
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

  console.log(result);

  if (result.rooms.length === 0) {
    //No room data available
    console.log("No room data available");
    return -1;
  }

  hotelRoomDataDTOClassList.clearHotelRoomDataDTOs(); //clear the list first, else there will be duplicates. For every call of this function
  // (which is initiated from the endpoint call) we will do a renewed API query and thus add the data to a fresh list.

  //Now, result is the list of rooms
  rooms = result.rooms;
  console.log(rooms);

  for (let i = 0; i < rooms.length; i++) {
    try {
      let hotelRoomDTOObject = transferSingleRoomDetails(rooms[i]);
      hotelRoomDataDTOClassList.addHotelRoomDataDTO(hotelRoomDTOObject);
    } catch (error) {
      console.log("Room data has invalid information", error);
    }
  }
  console.log("Finished initialising room data");
  return 0;
}

async function getSingleHotelDetailsWithoutPrice(hotelId) {
  const response = await fetch(
    `https://hotelapi.loyalty.dev/api/hotels/${hotelId}`,
    {
      method: "GET",
    }
  );

  result = await response.json();
  return result;
}

module.exports = {
  hotelRoomDataDTOClassList,
  getSingleHotelPriceDetails,
  getSingleHotelDetailsWithoutPrice,
  HotelRoomDataTransferService,
};
