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
        .setSearchRank(pricingRanking_data.search_rank)
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

        expect(pricingRankingDataTestDTOObject.getRank()).toBe("4.8");
        expect(pricingRankingDataTestDTOObject.getSearchRank()).toBe("5.0");
        expect(pricingRankingDataTestDTOObject.getPriceType()).toBe("Single");
        expect(pricingRankingDataTestDTOObject.getFreeCancellation()).toBe(true);
        expect(pricingRankingDataTestDTOObject.getRoomsAvailable()).toBe(30);
        expect(pricingRankingDataTestDTOObject.getMaxCashPayment()).toBe("2890.70");
        expect(pricingRankingDataTestDTOObject.getPoints()).toBe("40");
        expect(pricingRankingDataTestDTOObject.getBonuses()).toBe("50.0");
        expect(pricingRankingDataTestDTOObject.getBonusTiers()).toBe("NA");
        expect(pricingRankingDataTestDTOObject.getLowestPrice()).toBe("2500.50");
        expect(pricingRankingDataTestDTOObject.getPrice()).toBe("2650.73");
        expect(pricingRankingDataTestDTOObject.getConvertedMaxCashPayment()).toBe("5880.50");
        expect(pricingRankingDataTestDTOObject.getConvertedPrice()).toBe("4600.25");
        expect(pricingRankingDataTestDTOObject.getLowestConvertedPrice()).toBe("4600.00");
        expect(pricingRankingDataTestDTOObject.getMarketRates()).toStrictEqual(new Array(
          {
            supplier: "expedia",
            rates: "2.50"
          }
        ));
  });

  test("Testing the OriginalMetaData subclass. Should return a class objet with attributes being set.", ()=>{
    originalMetaData_data = {
      name : "United States of America",
      city : "Washington, DC.",
      state : "Washington, DC.",
      country : "US"
    };

    originalMetaDataTestDTOObject = new hotelDataDTO.OriginalMetaData.Builder()
    .setName(originalMetaData_data.name)
    .setCity(originalMetaData_data.city)
    .setState(originalMetaData_data.state)
    .setCountry(originalMetaData_data.country)
    .build();

    expect(originalMetaDataTestDTOObject.getName()).toBe("United States of America");
    expect(originalMetaDataTestDTOObject.getCity()).toBe("Washington, DC.");
    expect(originalMetaDataTestDTOObject.getState()).toBe("Washington, DC.");
    expect(originalMetaDataTestDTOObject.getCountry()).toBe("US");
  });

  test("Testing the TrustYouBenchmark subclass. Should return a class object with attributes being set.", ()=>{
    trustYouBenchmark_data = {
      trustYouId : "1ed9",
      score : {
        "Overall":7.5,
        "Romantic": 8.0,
        "Business": 1.0,
        "Casual":9.2
      },
    };

    trustYouBenchmarkTestDTOObject = new hotelDataDTO.TrustYouBenchmark.Builder()
    .setTrustYouId(trustYouBenchmark_data.trustYouId)
    .setTrustYouScoreParameters(trustYouBenchmark_data.score)
    .build();

    expect(trustYouBenchmarkTestDTOObject.getTrustYouId()).toBe("1ed9");
    expect(trustYouBenchmarkTestDTOObject.getScore()).toStrictEqual({
        "Overall":7.5,
        "Romantic": 8.0,
        "Business": 1.0,
        "Casual":9.2
      });
  });

  test("Testing the Amenities subclass. Should return a class object with attributes being set.", ()=>{
    amenities_data = {
      "Emporio Armani Eau De Cologne":true,
      "Maps":true,
      "Spare tires":true,
      "Henessey Venom GT Daily Test Drive":true,
      "toilet paper":false,
    };

    amenitiesTestDTOObject = new hotelDataDTO.Amenities.Builder()
    .setAmenities(amenities_data).build();

    expect(amenitiesTestDTOObject.getAmenities()).toStrictEqual({
      "Emporio Armani Eau De Cologne":true,
      "Maps":true,
      "Spare tires":true,
      "Henessey Venom GT Daily Test Drive":true,
      "toilet paper":false,
    });
  })
});

describe("Testing the ImageDetails subclass separately. Test cases accounting for absence of imageCount, URL Prefix and Suffix respectively.", ()=>{
  test("Testing with all 3 attributes present: proper image URL prefix, suffix and image count. Class boolean attribute bNoAvailableImages should return false.", ()=>{
    imageDetailsData = {
      hires_image_index:"1,2,3,4,5",
      image_url_prefix:"https://imageViewer/",
      image_url_suffix:".jpg"
    }

    imageDetailsDTOTestObject = new hotelDataDTO.ImageDetails.Builder()
    .setImageCounts(imageDetailsData.hires_image_index)
    .setImageUrlPrefix(imageDetailsData.image_url_prefix)
    .setImageUrlSuffix(imageDetailsData.image_url_suffix)
    .build();

    expect(imageDetailsDTOTestObject.getImageCounts()).toStrictEqual(new Array("1","2","3","4","5"));
    expect(imageDetailsDTOTestObject.getImageUrlPrefix()).toBe("https://imageViewer/");
    expect(imageDetailsDTOTestObject.getImageUrlSuffix()).toBe(".jpg");
    expect(imageDetailsDTOTestObject.noAvailableImages()).toBe(false);
  });

  test("Testing with attribute image count absent. Class boolean attribute bNoAvailableImages should return true.", ()=>{
    imageDetailsData = {
      hires_image_index:"",
      image_url_prefix:"https://imageViewer/",
      image_url_suffix:".jpg"
    }

    imageDetailsDTOTestObject = new hotelDataDTO.ImageDetails.Builder()
    .setImageCounts(imageDetailsData.hires_image_index)
    .setImageUrlPrefix(imageDetailsData.image_url_prefix)
    .setImageUrlSuffix(imageDetailsData.image_url_suffix)
    .build();

    expect(imageDetailsDTOTestObject.getImageCounts()).toBe(null);
    expect(imageDetailsDTOTestObject.getImageUrlPrefix()).toBe("https://imageViewer/");
    expect(imageDetailsDTOTestObject.getImageUrlSuffix()).toBe(".jpg");
    expect(imageDetailsDTOTestObject.noAvailableImages()).toBe(true);
  });

  test("Testing with attribute image URL prefix absent. Class boolean attribute bNoAvailableImages should return true.", ()=>{
    imageDetailsData = {
      hires_image_index:"1,2,3,4,5",
      image_url_prefix:"",
      image_url_suffix:".jpg"
    }

    imageDetailsDTOTestObject = new hotelDataDTO.ImageDetails.Builder()
    .setImageCounts(imageDetailsData.hires_image_index)
    .setImageUrlPrefix(imageDetailsData.image_url_prefix)
    .setImageUrlSuffix(imageDetailsData.image_url_suffix)
    .build();

    expect(imageDetailsDTOTestObject.getImageCounts()).toStrictEqual(new Array("1","2","3","4","5"));
    expect(imageDetailsDTOTestObject.getImageUrlPrefix()).toBe(null);
    expect(imageDetailsDTOTestObject.getImageUrlSuffix()).toBe(".jpg");
    expect(imageDetailsDTOTestObject.noAvailableImages()).toBe(true);
    
  });

  test("Testing with attribute image URL suffix absent. Class boolean attribute bNoAvailableImages should return true.", async()=>{
    imageDetailsData = {
      hires_image_index:"1,2,3,4,5",
      image_url_prefix:"https://imageViewer/",
      image_url_suffix:""
    }

    imageDetailsDTOTestObject = new hotelDataDTO.ImageDetails.Builder()
    .setImageCounts(imageDetailsData.hires_image_index)
    .setImageUrlPrefix(imageDetailsData.image_url_prefix)
    .setImageUrlSuffix(imageDetailsData.image_url_suffix)
    .build();

    expect(imageDetailsDTOTestObject.getImageCounts()).toStrictEqual(new Array("1","2","3","4","5"));
    expect(imageDetailsDTOTestObject.getImageUrlPrefix()).toBe("https://imageViewer/");
    expect(imageDetailsDTOTestObject.getImageUrlSuffix()).toBe(null);
    expect(imageDetailsDTOTestObject.noAvailableImages()).toBe(true);
  });
});
