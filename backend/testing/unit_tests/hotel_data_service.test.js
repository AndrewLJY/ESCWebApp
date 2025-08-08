//Test if this service module is able to initiate the transfer of data properly.

const request = require("supertest");
const hotelDataDTOServiceModule = require("../../hotel_data/hotel_data_service");
const hotelDataDTOModule = require("../../hotel_data/hotel_data_DTO");

//Mock the jsondata recieved from Ascenda. Should be able to facilitate the data transference by initialising the respective attributes in the DTO unit below, through its builder pattern
describe("(WHITE-BOX UNIT) Testing hotel_data_service, its facilitation of data transference by initialising attributes in the test hotel_data DTO", () => {
  testJSONData = {
    id: "obxM",
    imageCount: 100,
    latitude: 1.3122,
    longitude: 103.8606,
    name: "Mercure Singapore Tyrwhitt",
    address: "165 Tyrwhitt Road",
    address1: "165 Tyrwhitt Road",
    rating: 3,
    distance: 11548.359549931,
    trustyou: {
      id: "51a33b0f-91a4-4c02-963a-2c0155973ccc",
      score: {
        overall: 86,
        kaligo_overall: 4.3,
        solo: 85,
        couple: 87,
        family: 86,
        business: 80,
      },
    },
    categories: {},
    amenities_ratings: [],
    description:
      "Don't miss out on recreational opportunities including an outdoor pool and a fitness center. This hotel also features complimentary wireless internet access, concierge services, and bike parking.\n\nEnjoy a meal at the restaurant or snacks in the hotel's coffee shop/cafe. Quench your thirst with your favorite drink at the bar/lounge. Full breakfasts are available daily from 7 AM to 10:30 AM for a fee.\n\nFeatured amenities include dry cleaning/laundry services, a 24-hour front desk, and multilingual staff. Free self parking is available onsite.\n\nMake yourself at home in one of the 270 air-conditioned rooms featuring LCD televisions. Complimentary wireless internet access keeps you connected, and cable programming is available for your entertainment. Private bathrooms with showers feature complimentary toiletries and hair dryers. Conveniences include safes and desks, as well as phones with free local calls.\n\nDistances are displayed to the nearest 0.1 mile and kilometer. \u003Cbr /\u003E \u003Cp\u003ECity Square Mall - 0.5 km / 0.3 mi \u003Cbr /\u003E Mustafa Centre - 0.7 km / 0.5 mi \u003Cbr /\u003E Bugis Street Shopping District - 1.2 km / 0.7 mi \u003Cbr /\u003E Sultan Mosque - 1.4 km / 0.9 mi \u003Cbr /\u003E Haji Lane - 1.5 km / 0.9 mi \u003Cbr /\u003E Bugis+ Shopping Center - 1.7 km / 1.1 mi \u003Cbr /\u003E Bugis Junction Shopping Center - 1.7 km / 1.1 mi \u003Cbr /\u003E Singapore National Stadium - 2.2 km / 1.4 mi \u003Cbr /\u003E Singapore Art Museum - 2.2 km / 1.4 mi \u003Cbr /\u003E Bras Basah Complex - 2.2 km / 1.4 mi \u003Cbr /\u003E Fort Canning Park - 2.4 km / 1.5 mi \u003Cbr /\u003E National Museum of Singapore - 2.4 km / 1.5 mi \u003Cbr /\u003E Suntec City - 2.5 km / 1.5 mi \u003Cbr /\u003E Suntec Singapore - 2.5 km / 1.6 mi \u003Cbr /\u003E Mount Elizabeth Novena Hospital - 2.6 km / 1.6 mi \u003Cbr /\u003E \u003C/p\u003E\u003Cp\u003EThe nearest airports are:\u003Cbr /\u003ESeletar Airport (XSP) - 14.4 km / 8.9 mi\u003Cbr /\u003E Singapore Changi Airport (SIN) - 19.8 km / 12.3 mi\u003Cbr /\u003E Senai International Airport (JHB) - 72.9 km / 45.3 mi\u003Cbr /\u003E \u003C/p\u003E\u003Cp\u003E\u003C/p\u003E\n\nA stay at Mercure Singapore Tyrwhitt places you in the heart of Singapore, within a 15-minute walk of Mustafa Centre and Bugis Street Shopping District.  This hotel is 2.6 mi (4.2 km) from Marina Bay Sands Skypark and 2.7 mi (4.3 km) from Orchard Road.\n\nNear Mustafa Centre",
    amenities: {
      airConditioning: true,
      businessCenter: true,
      dataPorts: true,
      dryCleaning: true,
      hairDryer: true,
      inHouseDining: true,
      meetingRooms: true,
      outdoorPool: true,
      safe: true,
      tVInRoom: true,
    },
    original_metadata: {
      name: null,
      city: "Singapore",
      state: null,
      country: "SG",
    },
    image_details: {
      suffix: ".jpg",
      count: 100,
      prefix: "https://d2ey9sqrvkqdfs.cloudfront.net/obxM/",
    },
    hires_image_index:
      "0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48",
    number_of_images: 43,
    default_image_index: 1,
    imgix_url: "https://kaligo-web-expedia.imgix.net",
    cloudflare_image_url: "https://www.kaligo-staging.xyz/images/new",
    checkin_time: "3:00 PM",
    searchRank: 0.93,
    price_type: "multi",
    free_cancellation: true,
    rooms_available: "19992",
    max_cash_payment: "2313.59",
    coverted_max_cash_payment: "3014.63",
    points: "75350",
    bonuses: 0,
    bonus_programs: [],
    bonus_tiers: [],
    lowest_price: "2313.59",
    price: "3014.63",
    converted_price: "3014.63",
    lowest_converted_price: "3014.63",
    market_rates: [
      {
        supplier: "expedia",
        rate: "2668.849503624",
      },
    ],
  };

  testDTOObjectKeyDetails = new hotelDataDTOModule.KeyDetails.Builder()
    .setId(testJSONData.id)
    .setImageCount(testJSONData.imageCount)
    .setLatitude(testJSONData.latitude)
    .setLongitude(testJSONData.longitude)
    .setName(testJSONData.name)
    .setAddress(testJSONData.address)
    .setAddress1(testJSONData.address1)
    .setRating(testJSONData.rating)
    .setDistance(testJSONData.distance)
    .setCheckinTime(testJSONData.checkin_time)
    .setDescription(testJSONData.description)
    .build();

  testDTOObjectITrustYouScore =
    new hotelDataDTOModule.TrustYouBenchmark.Builder()
      .setTrustYouId(testJSONData.trustyou.id)
      .setTrustYouScoreParameters(testJSONData.trustyou)
      .build();

  testDTOObjectPricingRankingData =
    new hotelDataDTOModule.PricingRankingData.Builder()
      .setRank(testJSONData.rank)
      .setSearchRank(testJSONData.searchRank)
      .setPriceType(testJSONData.price_type)
      .setFreeCancellation(testJSONData.free_cancellation)
      .setRoomsAvailable(testJSONData.rooms_available)
      .setMaxCashPayment(testJSONData.max_cash_payment)
      .setPoints(testJSONData.points)
      .setBonuses(testJSONData.bonuses)
      .setBonusTiers(testJSONData.bonus_tiers)
      .setLowestPrice(testJSONData.lowest_price)
      .setPrice(testJSONData.price)
      .setConvertedPrice(testJSONData.converted_price)
      .setLowestConvertedPrice(testJSONData.lowest_converted_price)
      .setMarketRates(testJSONData.market_rates)
      .build();

  testDTOObjectImageDetails = new hotelDataDTOModule.ImageDetails.Builder()
    .setImageCounts(testJSONData.hires_image_index)
    .setImageUrlPrefix(testJSONData.image_details.prefix)
    .setImageUrlSuffix(testJSONData.image_details.suffix)
    .stitchImageUrls()
    .build();

  testDTOObjectAmenities = new hotelDataDTOModule.Amenities.Builder()
    .setAmenities(testJSONData.amenities)
    .build();

  testDTOObjectOriginalMetaData =
    new hotelDataDTOModule.OriginalMetaData.Builder()
      .setName(testJSONData.original_metadata.name)
      .setCity(testJSONData.original_metadata.city)
      .setState(testJSONData.original_metadata.state)
      .setCountry(testJSONData.original_metadata.country)
      .build();

  test("Test if the Transfer Service works for a given set of particular hotel data. Should initialise all attributes as provided.", () => {
    hotelDataTransferService =
      new hotelDataDTOServiceModule.HotelDataTransferService(testJSONData);

    candidateHotelDataDTOClass = hotelDataTransferService
      .transferOriginalMetaData()
      .transferAmenitiesData()
      .transferITrustYouScore()
      .transferPricingRankingData()
      .transferKeyDetails()
      .transferImageDetails()
      .getNewHotelDataDTOClass();

    expect(candidateHotelDataDTOClass.getKeyDetails()).toStrictEqual(
      testDTOObjectKeyDetails
    );
    expect(candidateHotelDataDTOClass.getAmenities()).toStrictEqual(
      testDTOObjectAmenities
    );

    expect(candidateHotelDataDTOClass.getImageDetails()).toStrictEqual(
      testDTOObjectImageDetails
    );
    expect(candidateHotelDataDTOClass.getPricingRankingData()).toStrictEqual(
      testDTOObjectPricingRankingData
    );
    expect(candidateHotelDataDTOClass.getOriginalMetaData()).toStrictEqual(
      testDTOObjectOriginalMetaData
    );
    expect(candidateHotelDataDTOClass.getTrustYouBenchmark()).toStrictEqual(
      testDTOObjectITrustYouScore
    );
  });
});
