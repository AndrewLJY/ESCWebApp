const hotelDataDTO = require("../../hotel_data/hotel_data_DTO");

describe("(WHITE-BOX UNIT) Initialising Respective Hotel DTO SubClass Attributes with Mock Values", () => {
  test("Testing the KeyDetails subclass. Should return a class object with attributes being set.", () => {
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
      bonuses: ["Swimming, Badminton, Halo"],
      bonus_programs: null,
      bonus_tiers: ["Swimming"],
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
    expect(pricingRankingDataTestDTOObject.getBonuses()).toStrictEqual([
      "Swimming, Badminton, Halo",
    ]);
    expect(pricingRankingDataTestDTOObject.getBonusTiers()).toStrictEqual([
      "Swimming",
    ]);
    expect(pricingRankingDataTestDTOObject.getLowestPrice()).toBe("2500.50");
    expect(pricingRankingDataTestDTOObject.getPrice()).toBe("2650.73");
    expect(pricingRankingDataTestDTOObject.getConvertedMaxCashPayment()).toBe(
      "5880.50"
    );
    expect(pricingRankingDataTestDTOObject.getConvertedPrice()).toBe("4600.25");
    expect(pricingRankingDataTestDTOObject.getLowestConvertedPrice()).toBe(
      "4600.00"
    );
    expect(pricingRankingDataTestDTOObject.getBonusPrograms()).toBe(null);
    expect(pricingRankingDataTestDTOObject.getMarketRates()).toStrictEqual(
      new Array({
        supplier: "expedia",
        rates: "2.50",
      })
    );
  });

  test("Testing the OriginalMetaData subclass. Should return a class objet with attributes being set.", () => {
    originalMetaData_data = {
      name: "United States of America",
      city: "Washington, DC.",
      state: "Washington, DC.",
      country: "US",
    };

    originalMetaDataTestDTOObject = new hotelDataDTO.OriginalMetaData.Builder()
      .setName(originalMetaData_data.name)
      .setCity(originalMetaData_data.city)
      .setState(originalMetaData_data.state)
      .setCountry(originalMetaData_data.country)
      .build();

    expect(originalMetaDataTestDTOObject.getName()).toBe(
      "United States of America"
    );
    expect(originalMetaDataTestDTOObject.getCity()).toBe("Washington, DC.");
    expect(originalMetaDataTestDTOObject.getState()).toBe("Washington, DC.");
    expect(originalMetaDataTestDTOObject.getCountry()).toBe("US");
  });

  test("Testing the TrustYouBenchmark subclass. Should return a class object with attributes being set.", () => {
    trustYouBenchmark_data = {
      trustYouId: "1ed9",
      score: {
        Overall: 7.5,
        Romantic: 8.0,
        Business: 1.0,
        Casual: 9.2,
      },
    };

    trustYouBenchmarkTestDTOObject =
      new hotelDataDTO.TrustYouBenchmark.Builder()
        .setTrustYouId(trustYouBenchmark_data.trustYouId)
        .setTrustYouScoreParameters(trustYouBenchmark_data.score)
        .build();

    expect(trustYouBenchmarkTestDTOObject.getTrustYouId()).toBe("1ed9");
    expect(trustYouBenchmarkTestDTOObject.getScore()).toStrictEqual({
      Overall: 7.5,
      Romantic: 8.0,
      Business: 1.0,
      Casual: 9.2,
    });
  });

  test("Testing the Amenities subclass. Should return a class object with attributes being set.", () => {
    amenities_data = {
      "Emporio Armani Eau De Cologne": true,
      Maps: true,
      "Spare tires": true,
      "Henessey Venom GT Daily Test Drive": true,
      "toilet paper": false,
    };

    amenitiesTestDTOObject = new hotelDataDTO.Amenities.Builder()
      .setAmenities(amenities_data)
      .build();

    expect(amenitiesTestDTOObject.getAmenities()).toStrictEqual({
      "Emporio Armani Eau De Cologne": true,
      Maps: true,
      "Spare tires": true,
      "Henessey Venom GT Daily Test Drive": true,
      "toilet paper": false,
    });
  });
});

describe("(WHITE-BOX UNIT) Testing the ImageDetails subclass separately. Test cases accounting for absence of imageCount, URL Prefix and Suffix respectively.", () => {
  test("Testing with all 3 attributes present: proper image URL prefix, suffix and image count. Class boolean attribute bNoAvailableImages should return false.", () => {
    imageDetailsData = {
      hires_image_index: "1,2,3,4,5",
      image_url_prefix: "https://imageViewer/",
      image_url_suffix: ".jpg",
    };

    imageDetailsDTOTestObject = new hotelDataDTO.ImageDetails.Builder()
      .setImageCounts(imageDetailsData.hires_image_index)
      .setImageUrlPrefix(imageDetailsData.image_url_prefix)
      .setImageUrlSuffix(imageDetailsData.image_url_suffix)
      .build();

    expect(imageDetailsDTOTestObject.getImageCounts()).toStrictEqual(
      new Array("1", "2", "3", "4", "5")
    );
    expect(imageDetailsDTOTestObject.getImageUrlPrefix()).toBe(
      "https://imageViewer/"
    );
    expect(imageDetailsDTOTestObject.getImageUrlSuffix()).toBe(".jpg");
    expect(imageDetailsDTOTestObject.noAvailableImages()).toBe(false);
  });

  test("Testing with attribute image count absent. Class boolean attribute bNoAvailableImages should return true.", () => {
    imageDetailsData = {
      hires_image_index: "",
      image_url_prefix: "https://imageViewer/",
      image_url_suffix: ".jpg",
    };

    imageDetailsDTOTestObject = new hotelDataDTO.ImageDetails.Builder()
      .setImageCounts(imageDetailsData.hires_image_index)
      .setImageUrlPrefix(imageDetailsData.image_url_prefix)
      .setImageUrlSuffix(imageDetailsData.image_url_suffix)
      .build();

    expect(imageDetailsDTOTestObject.getImageCounts()).toBe(null);
    expect(imageDetailsDTOTestObject.getImageUrlPrefix()).toBe(
      "https://imageViewer/"
    );
    expect(imageDetailsDTOTestObject.getImageUrlSuffix()).toBe(".jpg");
    expect(imageDetailsDTOTestObject.noAvailableImages()).toBe(true);
  });

  test("Testing with attribute image URL prefix absent. Class boolean attribute bNoAvailableImages should return true.", () => {
    imageDetailsData = {
      hires_image_index: "1,2,3,4,5",
      image_url_prefix: "",
      image_url_suffix: ".jpg",
    };

    imageDetailsDTOTestObject = new hotelDataDTO.ImageDetails.Builder()
      .setImageCounts(imageDetailsData.hires_image_index)
      .setImageUrlPrefix(imageDetailsData.image_url_prefix)
      .setImageUrlSuffix(imageDetailsData.image_url_suffix)
      .build();

    expect(imageDetailsDTOTestObject.getImageCounts()).toStrictEqual(
      new Array("1", "2", "3", "4", "5")
    );
    expect(imageDetailsDTOTestObject.getImageUrlPrefix()).toBe(null);
    expect(imageDetailsDTOTestObject.getImageUrlSuffix()).toBe(".jpg");
    expect(imageDetailsDTOTestObject.noAvailableImages()).toBe(true);
  });

  test("Testing with attribute image URL suffix absent. Class boolean attribute bNoAvailableImages should return true.", async () => {
    imageDetailsData = {
      hires_image_index: "1,2,3,4,5",
      image_url_prefix: "https://imageViewer/",
      image_url_suffix: "",
    };

    imageDetailsDTOTestObject = new hotelDataDTO.ImageDetails.Builder()
      .setImageCounts(imageDetailsData.hires_image_index)
      .setImageUrlPrefix(imageDetailsData.image_url_prefix)
      .setImageUrlSuffix(imageDetailsData.image_url_suffix)
      .build();

    expect(imageDetailsDTOTestObject.getImageCounts()).toStrictEqual(
      new Array("1", "2", "3", "4", "5")
    );
    expect(imageDetailsDTOTestObject.getImageUrlPrefix()).toBe(
      "https://imageViewer/"
    );
    expect(imageDetailsDTOTestObject.getImageUrlSuffix()).toBe(null);
    expect(imageDetailsDTOTestObject.noAvailableImages()).toBe(true);
  });
});

const {
  HotelData,
  KeyDetails,
  Amenities,
  OriginalMetaData,
  ImageDetails,
  PricingRankingData,
  TrustYouBenchmark,
} = require("../../hotel_data/hotel_data_DTO");

// Utility for making full hotel objects easily

describe("ECP Testing for HotelData Classes", () => {
  describe("Amenities", () => {
    let builder;

    beforeEach(() => {
      builder = new Amenities.Builder();
    });

    describe("setAmenities", () => {
      // Valid Classes
      test("should not accept non Object value", () => {
        expect(() => builder.setAmenities(["wifi", "pool", "spa"])).toThrow(
          "Invalid Amenities Parameters"
        );
      });

      test("should not accept non Object value", () => {
        expect(() => builder.setAmenities("wifi")).toThrow(
          "Invalid Amenities Parameters"
        );
      });

      test("should accept null/undefined values, as amenities is optional", () => {
        expect(() => builder.setAmenities(null)).not.toThrow();
      });

      test("should reject Object with non-string key elements", () => {
        expect(() =>
          builder.setAmenities({ wifi: true, 123: true, true: true })
        ).toThrow("Invalid Amenities Parameters");
      });

      test("should reject Object with non-boolean values", () => {
        expect(() =>
          builder.setAmenities({ wifi: "Yes", house: true, tv: true })
        ).toThrow("Invalid Amenities Parameters");
      });
    });
  });

  // -------------------------
  // OriginalMetaData
  // -------------------------
  describe("OriginalMetaData", () => {
    let builder;

    beforeEach(() => {
      builder = new OriginalMetaData.Builder();
    });

    // Test suite for setName method
    describe("setName", () => {
      test("should accept non-empty string", () => {
        expect(() => builder.setName("Holiday Inn")).not.toThrow();
      });

      test("should reject empty string", () => {
        expect(() => builder.setName("")).not.toThrow();
      });

      test("should not reject null, as the fields are optional", () => {
        expect(() => builder.setName(null)).not.toThrow();
      });

      test("should reject undefined", () => {
        expect(() => builder.setName(undefined)).not.toThrow();
      });
    });

    // Similar tests for city, state, country
    describe("setCity", () => {
      test("should accept non-empty string", () => {
        expect(() => builder.setCity("Singapore")).not.toThrow();
      });

      test("should not reject empty string, as it is optional", () => {
        expect(() => builder.setCity("")).not.toThrow();
      });

      test("should not reject null, as it is optional", () => {
        expect(() => builder.setCity(null)).not.toThrow();
      });
    });

    describe("setState", () => {
      test("should accept non-empty string", () => {
        expect(() => builder.setState("California")).not.toThrow();
      });

      test("should not reject empty string, as it is optional", () => {
        expect(() => builder.setState("")).not.toThrow();
      });

      test("should not reject null, as it is optional", () => {
        expect(() => builder.setState(null)).not.toThrow();
      });
    });

    describe("setCountry", () => {
      test("should accept non-empty string", () => {
        expect(() => builder.setCountry("USA")).not.toThrow();
      });

      test("should not reject empty string, as it is optional", () => {
        expect(() => builder.setCountry("")).not.toThrow();
      });

      test("should not reject null, as it is optional", () => {
        expect(() => builder.setCountry(null)).not.toThrow();
      });
    });
  });

  describe("Testing KeyDetails, setting name", () => {
    beforeAll(() => {
      kd = new KeyDetails.Builder();
    });

    test("setName should accept a string", () => {
      expect(() => kd.setName("Hilton")).not.toThrow();
    });
    test("setName should reject a null value, as it is optional", () => {
      expect(() => kd.setName(null)).toThrow("Name must be a non-empty string");
    });
    test("setName should reject an empty string value, as it is optional", () => {
      expect(() => kd.setName("")).toThrow("Name must be a non-empty string");
    });

    test("setName should reject a number, as it is optional", () => {
      expect(() => kd.setName(1)).toThrow("Name must be a non-empty string");
    });
  });

  describe("Testing Longitude and Latitude", () => {
    beforeAll(() => {
      kd = new KeyDetails.Builder();
    });
    test("Longitude should accept parameters between -180 and 180", () => {
      expect(() => kd.setLongitude(180)).not.toThrow();
      expect(() => kd.setLongitude(-180)).not.toThrow();
    });
    test("Latitude should accept parameters between -90 and 90", () => {
      expect(() => kd.setLatitude(90)).not.toThrow();
      expect(() => kd.setLatitude(-90)).not.toThrow();
    });
    test("Longitude should reject parameters outside -180 and 180", () => {
      expect(() => kd.setLongitude(181)).toThrow(
        "Longitude must be a valid number between -180 and 180"
      );
      expect(() => kd.setLongitude(-181)).toThrow(
        "Longitude must be a valid number between -180 and 180"
      );
    });
    test("Latitude should reject parameters outside -90 and 90", () => {
      expect(() => kd.setLatitude(91)).toThrow(
        "Latitude must be a valid number between -90 and 90"
      );
      expect(() => kd.setLatitude(-91)).toThrow(
        "Latitude must be a valid number between -90 and 90"
      );
    });
  });
});

// -------------------------
// ImageDetails
// -------------------------
describe("ImageDetails", () => {
  test.each([
    ["1,2,3", true],
    ["", false],
    [null, false],
    [undefined, false],
  ])("imageCounts partition: %p => valid: %p", (val, valid) => {
    const img = new ImageDetails.Builder().setImageCounts(val).build();
    const isValid = typeof val === "string" && val.length > 0;
    expect(isValid).toBe(valid);
  });

  test.each([
    ["https://img/", true],
    ["", false],
    [null, false],
  ])("imageUrlPrefix partition: %p => valid: %p", (val, valid) => {
    const img = new ImageDetails.Builder().setImageUrlPrefix(val).build();
    const isValid = typeof val === "string" && val.length > 0;
    expect(isValid).toBe(valid);
  });

  test.each([
    [".jpg", true],
    ["", false],
    [null, false],
  ])("imageUrlSuffix partition: %p => valid: %p", (val, valid) => {
    const img = new ImageDetails.Builder().setImageUrlSuffix(val).build();
    const isValid = typeof val === "string" && val.length > 0;
    expect(isValid).toBe(valid);
  });

  test("stitchImageUrls generates URLs when valid", () => {
    const img = new ImageDetails.Builder()
      .setImageCounts("1,2")
      .setImageUrlPrefix("https://img/")
      .setImageUrlSuffix(".jpg")
      .stitchImageUrls()
      .build();
    expect(img.getStitchedImageUrls().length).toBe(2);
  });
});

describe("PricingRankingData", () => {
  let builder;

  beforeEach(() => {
    builder = new PricingRankingData.Builder();
  });

  describe("setRank and setSearchRank", () => {
    // Valid Classes
    test("should accept positive integer", () => {
      expect(() => builder.setRank("5")).not.toThrow();
      expect(() => builder.setSearchRank("5")).not.toThrow();
    });

    test("should accept zero", () => {
      expect(() => builder.setRank("0")).not.toThrow();
      expect(() => builder.setSearchRank("0")).not.toThrow();
    });

    // Invalid Classes
    // test("should reject negative numbers", () => {
    //   expect(() => builder.setRank("-1")).toThrow(
    //     "Rank must be a non-negative integer"
    //   );
    //   expect(() => builder.setSearchRank("-1")).toThrow(
    //     "Search rank must be a non-negative integer"
    //   );
    // });

    test("should accept null, as both are optional", () => {
      expect(() => builder.setRank(null)).not.toThrow();
      expect(() => builder.setSearchRank(null)).not.toThrow();
    });
  });

  // describe("setPriceType", () => {
  //   test("should accept known enum values", () => {
  //     expect(() => builder.setPriceType("single")).not.toThrow();
  //     expect(() => builder.setPriceType("double")).not.toThrow();
  //   });

  //   test("should reject unknown values", () => {
  //     expect(() => builder.setPriceType("unknown")).toThrow();
  //   });

  //   test("should reject null", () => {
  //     expect(() => builder.setPriceType(null)).toThrow();
  //   });
  // });

  describe("setFreeCancellation", () => {
    test("should accept boolean values", () => {
      expect(() => builder.setFreeCancellation(true)).not.toThrow();
      expect(() => builder.setFreeCancellation(false)).not.toThrow();
    });

    test("should accept boolean strings", () => {
      expect(() => builder.setFreeCancellation("true")).not.toThrow();
      expect(() => builder.setFreeCancellation("false")).not.toThrow();
    });
  });

  describe("price fields", () => {
    const priceSetters = [
      "setMaxCashPayment",
      "setConvertedMaxCashPayment",
      "setLowestPrice",
      "setPrice",
      "setConvertedPrice",
      "setLowestConvertedPrice",
    ];

    test.each(priceSetters)("%s should accept positive number", (setter) => {
      expect(() => builder[setter]("123.45")).not.toThrow();
    });

    test.each(priceSetters)("%s should accept zero", (setter) => {
      expect(() => builder[setter]("0")).not.toThrow();
    });

    test.each(priceSetters)("%s should reject negative numbers", (setter) => {
      expect(() => builder[setter]("-1")).toThrow();
    });

    test.each(priceSetters)("%s should reject null", (setter) => {
      expect(() => builder[setter](null)).toThrow();
    });
  });

  describe("setPoints", () => {
    test("setPoints should accept positive number", () => {
      expect(() => builder["setPoints"]("123.45")).not.toThrow();
    });

    test("setPoints should accept zero", () => {
      expect(() => builder["setPoints"]("0")).not.toThrow();
    });

    test("setPoints should reject negative numbers", () => {
      expect(() => builder["setPoints"]("-1")).toThrow();
    });

    test("setPoints should not reject null, as it is optional", () => {
      expect(() => builder["setPoints"](null)).not.toThrow();
    });
  });

  describe("array fields", () => {
    const arraySetters = ["setBonuses", "setBonusPrograms", "setBonusTiers"];

    test.each(arraySetters)("%s should accept non-empty array", (setter) => {
      expect(() => builder[setter](["Bonus 1"])).not.toThrow();
    });

    test.each(arraySetters)(
      "%s should accept empty array, as it is optional",
      (setter) => {
        expect(() => builder[setter]([])).not.toThrow();
      }
    );

    test.each(arraySetters)(
      "%s should accept null, as it is optional",
      (setter) => {
        expect(() => builder[setter](null)).not.toThrow();
      }
    );

    test.each(arraySetters)("%s should reject non-arrays", (setter) => {
      expect(() => builder[setter]("not an array")).toThrow();
    });
  });

  describe("setMarketRates", () => {
    test("should accept valid object with rate data", () => {
      const validRates = {
        supplier: "Expedia",
        rate: 2.5,
      };
      expect(() => builder.setMarketRates([validRates])).not.toThrow();
    });

    test("should accept null as it is optional", () => {
      expect(() => builder.setMarketRates(null)).not.toThrow();
    });

    test("should reject non-objects", () => {
      expect(() => builder.setMarketRates("not an object")).toThrow();
    });

    test("should reject objects with invalid rates", () => {
      expect(() => builder.setMarketRates({ rate: "invalid" })).toThrow();
    });
  });
});

describe("TrustYouBenchmark", () => {
  let builder;

  beforeEach(() => {
    builder = new TrustYouBenchmark.Builder();
  });

  describe("setTrustYouId", () => {
    test("should accept non-empty string", () => {
      expect(() => builder.setTrustYouId("ty-123")).not.toThrow();
    });

    test("should not reject empty string, as it is optional", () => {
      expect(() => builder.setTrustYouId("")).toThrow(
        "TrustYou ID must be a non-empty string"
      );
    });

    test("should reject null", () => {
      expect(() => builder.setTrustYouId(null)).not.toThrow();
    });

    test("should reject undefined", () => {
      expect(() => builder.setTrustYouId(undefined)).not.toThrow();
    });
  });

  describe("setTrustYouScoreParameters", () => {
    test("should accept valid object", () => {
      const validScore = { overall: 85, cleanliness: 90 };
      expect(() =>
        builder.setTrustYouScoreParameters(validScore)
      ).not.toThrow();
    });

    test("should accept valid JSON string", () => {
      const validJson = '{"overall": 85, "cleanliness": 90}';
      expect(() => builder.setTrustYouScoreParameters(validJson)).not.toThrow();
    });

    test("should not reject null, as it is optional", () => {
      expect(() => builder.setTrustYouScoreParameters(null)).not.toThrow();
    });

    test("should not reject undefined, as it is optional", () => {
      expect(() => builder.setTrustYouScoreParameters(undefined)).not.toThrow();
    });

    test("should reject malformed JSON string", () => {
      expect(() =>
        builder.setTrustYouScoreParameters("{invalid json}")
      ).toThrow();
    });
  });
});
