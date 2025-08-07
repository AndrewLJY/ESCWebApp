const hotelRoomDataTransferServiceModule = require("../../hotel_data/hotel_room_data_service");
const hotelRoomDataDTOModule = require("../../hotel_data/hotel_room_data_DTO");

describe("(WHITE-BOX UNIT) Testing hotel_room_data service, its facilitation of data transference, by initialising attributes in the test hotel_room_data DTO", () => {
  testJSONData = {
    key: "c9369179-69f3-530c-872f-5cf8c5b345d8",
    roomDescription: "Double room",
    roomNormalizedDescription: "Double Room",
    type: "1",
    free_cancellation: false,
    long_description: null,
    roomAdditionalInfo: {
      breakfastInfo: "hotel_detail_room_only",
      displayFields: {
        special_check_in_instructions: null,
        check_in_instructions: null,
        know_before_you_go: null,
        fees_optional: null,
        fees_mandatory: null,
        kaligo_service_fee: 0,
        hotel_fees: [],
        surcharges: [
          {
            type: "TaxAndServiceFee",
            amount: 544.41,
          },
        ],
      },
    },
    description: "Double room",
    price_type: "single",
    max_cash_payment: 4173.84,
    coverted_max_cash_payment: 5450.23,
    points: 136250,
    bonuses: 0,
    bonus_programs: [],
    bonus_tiers: [],
    lowest_price: 4173.84,
    price: 5450.23,
    converted_price: 5450.23,
    lowest_converted_price: 5450.23,
    chargeableRate: 4173.84,
    images: "https://d2ey9sqrvkqdfs.cloudfront.net/obxM/0.jpg",
    market_rates: [
      {
        supplier: "expedia",
        rate: 4710.6112420344,
      },
    ],
    base_rate: 3629.43,
    base_rate_in_currency: 4739.34,
    included_taxes_and_fees_total: 544.41,
    included_taxes_and_fees_total_in_currency: 710.9,
    excluded_taxes_and_fees_currency: "USD",
    excluded_taxes_and_fees_total: 0,
    excluded_taxes_and_fees_total_in_currency: 0,
    included_taxes_and_fees: [
      {
        id: "tax_and_service_fee",
        amount: 544.41,
        currency: "USD",
      },
    ],
    included_taxes_and_fees_in_currency: [
      {
        id: "tax_and_service_fee",
        amount: 710.9,
        currency: "SGD",
      },
    ],
  };

  keyRoomDetailsTestDTOObject =
    new hotelRoomDataDTOModule.KeyRoomDetails.Builder()
      .setKeyId(testJSONData.key)
      .setRoomDescription(testJSONData.roomDescription)
      .setRoomNormalisedDescription(testJSONData.roomNormalizedDescription)
      .setRoomTypeIndex(testJSONData.type)
      .setFreeCancellation(testJSONData.free_cancellation)
      .setLongDescription(testJSONData.long_description)
      .setRoomImages(testJSONData.images)
      .build();

  priceDetailsTestDTOObject = new hotelRoomDataDTOModule.PriceDetails.Builder()
    .setDescription(testJSONData.description)
    .setPriceType(testJSONData.price_type)
    .setMaxCashPayment(testJSONData.max_cash_payment)
    .setPoints(testJSONData.points)
    .setBonuses(testJSONData.bonuses)
    .setBonusPrograms(testJSONData.bonus_programs)
    .setChargeableRate(testJSONData.chargeableRate)
    .setBonusTiers(testJSONData.bonus_tiers)
    .setLowestPrice(testJSONData.lowest_price)
    .setPrice(testJSONData.price)
    .setCovertedMaxCashPayment(testJSONData.coverted_max_cash_payment)
    .setConvertedPrice(testJSONData.converted_price)
    .setLowestConvertedPrice(testJSONData.lowest_converted_price)
    .setMarketRates(testJSONData.market_rates)
    .build();

  taxDetailsTestDTOOject = new hotelRoomDataDTOModule.TaxDetails.Builder()
    .setBaseRate(testJSONData.base_rate)
    .setBaseRateInCurrency(testJSONData.base_rate_in_currency)
    .setIncludedTaxesFeesTotal(testJSONData.included_taxes_and_fees_total)
    .setIncludedTaxesFeesTotalInCurrency(
      testJSONData.included_taxes_and_fees_total_in_currency
    )
    .setExcludedTaxesFeesTotal(testJSONData.excluded_taxes_and_fees_total)
    .setExcludedTaxesFeesTotalInCurrency(
      testJSONData.excluded_taxes_and_fees_total_in_currency
    )
    .setIncludedTaxesFeesDetails(testJSONData.included_taxes_and_fees)
    .setIncludedTaxesFeesInCurrencyDetails(
      testJSONData.included_taxes_and_fees_in_currency
    )
    .build();

  roomAdditionalInfoTestDTOObject =
    new hotelRoomDataDTOModule.RoomAdditionalInfo.Builder()
      .setBreakfastInfo(testJSONData.roomAdditionalInfo.breakfastInfo)
      .setSpecialCheckInInstructions(
        testJSONData.roomAdditionalInfo.displayFields
          .special_check_in_instructions
      )
      .setKnowBeforeYouGo(
        testJSONData.roomAdditionalInfo.displayFields.know_before_you_go
      )
      .setOptionalFees(
        testJSONData.roomAdditionalInfo.displayFields.fees_optional
      )
      .setMandatoryFees(
        testJSONData.roomAdditionalInfo.displayFields.fees_mandatory
      )
      .setKaligoServiceFee(
        testJSONData.roomAdditionalInfo.displayFields.kaligo_service_fee
      )
      .setHotelFees(testJSONData.roomAdditionalInfo.displayFields.hotel_fees)
      .setSurcharges(testJSONData.roomAdditionalInfo.displayFields.surcharges)
      .build();

  test("Test if the Transfer Service works for a given set of particular hotel room data. Should initialise all attributes as provided.", () => {
    hotelRoomDataTransferService =
      new hotelRoomDataTransferServiceModule.HotelRoomDataTransferService(
        testJSONData
      );

    candidateHotelRoomDataDTOObject = hotelRoomDataTransferService
      .transferKeyRoomDetails()
      .transferPriceDetails()
      .transferRoomAdditionalInfo()
      .transferTaxDetails()
      .getNewHotelRoomDataDTOClass();

    expect(candidateHotelRoomDataDTOObject.getKeyRoomDetails()).toStrictEqual(
      keyRoomDetailsTestDTOObject
    );
    expect(candidateHotelRoomDataDTOObject.getPriceDetails()).toStrictEqual(
      priceDetailsTestDTOObject
    );
    expect(
      candidateHotelRoomDataDTOObject.getRoomAdditionalInfo()
    ).toStrictEqual(roomAdditionalInfoTestDTOObject);
    expect(candidateHotelRoomDataDTOObject.getTaxDetails()).toStrictEqual(
      taxDetailsTestDTOOject
    );
  });
});
