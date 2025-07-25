const hotelDataDTO = require("../../hotel_data/hotel_data_DTO");
const supertest = require("supertest");

describe("Initialising Respective Hotel DTO SubClass Attributes with Mock Values", () => {
  test("Testing the KeyDetails subclass. Should return a class object with attributes being set", () => {
    keyDetails_data = {
      id: "OXCM",
      imageCount: 3,
      latitude: "38.8951",
      longitude: "-77.0364",
      name: "The Washington Hotel",
      address: "Washington, DC. The Lincoln Memorial",
      address1: "NIL",
      checkin_time: "",
      rating: "5.0",
      distance: "5000",
      description:
        "A perfect stay to imbibe in the revolutionary spirit \nthat drove the first of our fathers, to the grand rebellion\n from which our nation birth'ed.",
    };

    keydetailsTestDTOObject = new hotelDataDTO.KeyDetails.Builder()
      .setId(keyDetails_data.id)
      .setImageCount(keyDetails_data.imageCount)
      .setLatitude(keyDetails_data.latitude)
      .setLongitude(keyDetails_data.longitude)
      .setName(keyDetails_data.name)
      .setAddress(keyDetails_data.address)
      .setAddress1(keyDetails_data.address1)
      .setRating(keyDetails_data.rating)
      .setDistance(keyDetails_data.distance)
      .setCheckinTime(keyDetails_data.checkin_time)
      .setDescription(keyDetails_data.description)
      .build();

    expect(keydetailsTestDTOObject.getId()).toBe("OXCM");
    expect(keydetailsTestDTOObject.getImageCount()).toBe(3);
    expect(keydetailsTestDTOObject.getLatitude()).toBe("38.8951");
    expect(keydetailsTestDTOObject.getLongitude()).toBe("-77.0364");
    expect(keydetailsTestDTOObject.getName()).toBe("The Washington Hotel");
    expect(keydetailsTestDTOObject.getAddress()).toBe(
      "Washington, DC. The Lincoln Memorial"
    );
    expect(keydetailsTestDTOObject.getAddress1()).toBe("NIL");
    expect(keydetailsTestDTOObject.getRating()).toBe("5.0");
    expect(keydetailsTestDTOObject.getDistance()).toBe("5000");
    expect(keydetailsTestDTOObject.getCheckInTime()).toBe("");
    expect(keydetailsTestDTOObject.getDescription()).toBe(
      "A perfect stay to imbibe in the revolutionary spirit \nthat drove the first of our fathers, to the grand rebellion\n from which our nation birth'ed."
    );
  });

  test("Testing the PricingRankingData subclass. Should return a class object with attributes being set.", () => {
    pricingRanking_data = {
      rank: "4.8",
      search_rank: "5.0",
      price_type: "Single",
      free_cancellation: true,
      rooms_available: 30,
      max_cash_payment: "2890.70",
      converted_max_cash_payment: "5880.50",
      points: "40",
      bonuses: "50.0",
      bonus_programs: "NA",
      bonus_tiers: "NA",
      lowest_price: "2500.50",
      price: "2650.73",
      converted_price: "4600.25",
      lowest_converted_price: "4600.00",
      market_rates: [
        {
          supplier: "expedia",
          rates: "2.50",
        },
      ],
    };

    pricingRankingDataTestDTOObject =
      new hotelDataDTO.PricingRankingData.Builder()
        .setRank(pricingRanking_data.rank)
        .setSearchRank(pricingRanking_data.searchRank)
        .setPriceType(pricingRanking_data.price_type)
        .setFreeCancellation(pricingRanking_data.free_cancellation)
        .setRoomsAvailable(pricingRanking_data.rooms_available)
        .setMaxCashPayment(pricingRanking_data.max_cash_payment)
        .setPoints(pricingRanking_data.points)
        .setBonuses(pricingRanking_data.bonuses)
        .setBonusTiers(pricingRanking_data.bonus_tiers)
        .setLowestPrice(pricingRanking_data.lowest_price)
        .setPrice(pricingRanking_data.price)
        .setConvertedMaxCashPayment(
          pricingRanking_data.converted_max_cash_payment
        )
        .setConvertedPrice(pricingRanking_data.converted_price)
        .setLowestConvertedPrice(pricingRanking_data.lowest_converted_price)
        .setMarketRates(pricingRanking_data.market_rates)
        .build();
  });
});
