const hotelRoomDataDTOModule = require("../../hotel_data/hotel_room_data_DTO");

describe("(WHITE-BOX UNIT) Testing the respective Hotel Room DTO subclasses, ensure code sets attributes for given arguments", () => {
  test("Testing the KeyRoomDetails subclass. Should return a class object with attributes being set.", () => {
    keyRoomDetails_data = {
      key: "c9369179-69f3-530c-872f-5cf8c5b345d8",
      roomDescription: "Double room",
      roomNormalizedDescription: "Double Room",
      type: "1",
      free_cancellation: false,
      long_description: null,
    };

    keyRoomDetailsTestDTOObject =
      new hotelRoomDataDTOModule.KeyRoomDetails.Builder()
        .setKeyId(keyRoomDetails_data.key)
        .setRoomDescription(keyRoomDetails_data.roomDescription)
        .setRoomNormalisedDescription(
          keyRoomDetails_data.roomNormalizedDescription
        )
        .setRoomTypeIndex(keyRoomDetails_data.type)
        .setFreeCancellation(keyRoomDetails_data.free_cancellation)
        .setLongDescription(keyRoomDetails_data.long_description)
        .build();

    expect(keyRoomDetailsTestDTOObject.getKeyId()).toBe(
      "c9369179-69f3-530c-872f-5cf8c5b345d8"
    );
    expect(keyRoomDetailsTestDTOObject.getRoomDescription()).toBe(
      "Double room"
    );
    expect(keyRoomDetailsTestDTOObject.getRoomNormalisedDescription()).toBe(
      "Double Room"
    );
    expect(keyRoomDetailsTestDTOObject.getRoomTypeIndex()).toBe("1");
    expect(keyRoomDetailsTestDTOObject.getFreeCancellation()).toBe(false);
    expect(keyRoomDetailsTestDTOObject.getLongDescription()).toBe(null);
  });

  test("Testing the TaxDetails class. Should return a class object with attributes being set.", () => {
    testJSONData = {
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

    taxDetailsTestDTOObject = new hotelRoomDataDTOModule.TaxDetails.Builder()
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

    expect(taxDetailsTestDTOObject.getBaseRate()).toBe(3629.43);
    expect(taxDetailsTestDTOObject.getBaseRateInCurrency()).toBe(4739.34);
    expect(taxDetailsTestDTOObject.getIncludedTaxesFeesTotal()).toBe(544.41);
    expect(taxDetailsTestDTOObject.getIncludedTaxesFeesTotalInCurrency()).toBe(
      710.9
    );
    expect(taxDetailsTestDTOObject.getExcludedTaxesFeesTotal()).toBe(0);
    expect(taxDetailsTestDTOObject.getExcludedTaxesFeesTotalInCurrency()).toBe(
      0
    );
    expect(taxDetailsTestDTOObject.getIncludedTaxesFeesDetails()).toStrictEqual(
      new Array({
        id: "tax_and_service_fee",
        amount: 544.41,
        currency: "USD",
      })
    );
    expect(
      taxDetailsTestDTOObject.getIncludedTaxesFeesInCurrencyDetails()
    ).toStrictEqual(
      new Array({
        id: "tax_and_service_fee",
        amount: 710.9,
        currency: "SGD",
      })
    );
    expect(
      taxDetailsTestDTOObject.getExcludedTaxesFeesInCurrencyDetails()
    ).toBe(null);
    expect(taxDetailsTestDTOObject.getExcludedTaxesFeesDetails()).toBe(null);
  });
  test("Testing the PriceDetails class. Should return a class object with attributes being set.", () => {
    testJSONData = {
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
      market_rates: [
        {
          supplier: "expedia",
          rate: 4710.6112420344,
        },
      ],
    };

    priceDetailsTestDTOObject =
      new hotelRoomDataDTOModule.PriceDetails.Builder()
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

    expect(priceDetailsTestDTOObject.getDescription()).toBe("Double room");
    expect(priceDetailsTestDTOObject.getChargeableRate()).toBe(4173.84);
    expect(priceDetailsTestDTOObject.getPriceType()).toBe("single");
    expect(priceDetailsTestDTOObject.getMaxCashPayment()).toBe(4173.84);
    expect(priceDetailsTestDTOObject.getPoints()).toBe(136250);
    expect(priceDetailsTestDTOObject.getBonuses()).toBe(0);
    expect(priceDetailsTestDTOObject.getBonusTiers()).toStrictEqual([]);
    expect(priceDetailsTestDTOObject.getBonusPrograms()).toStrictEqual([]);
    expect(priceDetailsTestDTOObject.getLowestPrice()).toBe(4173.84);
    expect(priceDetailsTestDTOObject.getPrice()).toBe(5450.23);
    expect(priceDetailsTestDTOObject.getCovertedMaxCashPayment()).toBe(5450.23);
    expect(priceDetailsTestDTOObject.getConvertedPrice()).toBe(5450.23);
    expect(priceDetailsTestDTOObject.getLowestConvertedPrice()).toBe(5450.23);
    expect(priceDetailsTestDTOObject.getMarketRates()).toStrictEqual(
      new Array({
        supplier: "expedia",
        rate: 4710.6112420344,
      })
    );
  });
  test("Testing the RoomAdditionalInfo class. Should return a class object with attributes being set.", () => {
    testJSONData = {
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
    };

    roomAdditionalInfoTestDTOObject =
      new hotelRoomDataDTOModule.RoomAdditionalInfo.Builder()
        .setBreakfastInfo(testJSONData.breakfastInfo)
        .setSpecialCheckInInstructions(
          testJSONData.displayFields.special_check_in_instructions
        )
        .setKnowBeforeYouGo(testJSONData.displayFields.know_before_you_go)
        .setOptionalFees(testJSONData.displayFields.fees_optional)
        .setMandatoryFees(testJSONData.displayFields.fees_mandatory)
        .setKaligoServiceFee(testJSONData.displayFields.kaligo_service_fee)
        .setHotelFees(testJSONData.displayFields.hotel_fees)
        .setSurcharges(testJSONData.displayFields.surcharges)
        .build();

    expect(roomAdditionalInfoTestDTOObject.getBreakfastInfo()).toBe(
      "hotel_detail_room_only"
    );
    expect(
      roomAdditionalInfoTestDTOObject.getSpecialCheckInInstructions()
    ).toBe(null);
    expect(roomAdditionalInfoTestDTOObject.getKnowBeforeYouGo()).toBe(null);
    expect(roomAdditionalInfoTestDTOObject.getOptionalFees()).toBe(null);
    expect(roomAdditionalInfoTestDTOObject.getMandatoryFees()).toBe(null);
    expect(roomAdditionalInfoTestDTOObject.getKaligoServiceFee()).toBe(0);
    expect(roomAdditionalInfoTestDTOObject.getHotelFees()).toStrictEqual([]);
    expect(roomAdditionalInfoTestDTOObject.getSurcharges()).toStrictEqual(
      new Array({
        type: "TaxAndServiceFee",
        amount: 544.41,
      })
    );
  });
});
