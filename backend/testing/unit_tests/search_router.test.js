const request = require("supertest");
const app = require("../../server");
const fc = require("fast-check");

const hotelDataTransferServiceModule = require("../../hotel_data/hotel_data_service");

process.env.INTEGRATION_TEST = "false";
process.env.NODE_ENV = "test";

describe("(WHITE-BOX UNIT) Testing the Indvidual Endpoints of the search.js router, ensure that we get a reponse.", () => {
  test("Testing /search endpoint, should return a 200 response OK", async () => {
    response = await request(app)
      .get("/search/Singapore,_Singapore/2025-10-10/2025-10-17/2/1")
      .expect(200);
    expect(response.body).toStrictEqual(
      "Hello from the backend, running main search endpoint now"
    );
  });

  test("Testing /search/AdvancedDisplay, should return a 200 response OK", async () => {
    response = await request(app)
      .get(
        "/search/AdvancedDisplay/Singapore,_Singapore/2025-10-10/2025-10-17/2/1"
      )
      .expect(200);
    expect(response.body).toStrictEqual(
      "Hello from the backend, running search/AdvancedDisplay endpoint now"
    );
  });

  test("Testing /search/MainDisplay endpoint, should return a 200 response OK", async () => {
    response = await request(app)
      .get("/search/MainDisplay/Singapore,_Singapore/2025-10-10/2025-10-17/2/1")
      .expect(200);
    expect(response.body).toStrictEqual(
      "Hello from the backend, running search/MainDisplay endpoint now"
    );
  });

  test("Testing /search/images/ endpoint, should return a 200 response OK", async () => {
    response = await request(app).get("/search/images").expect(200);
    expect(response.body).toStrictEqual(
      "Hello from the backend, running search/images endpoint now"
    );
  });

  test("Testing /search/hotel/prices endpoint, should return a 200 response OK", async () => {
    response = await request(app)
      .get(
        "/search/hotel/prices/diH7/Singapore,_Singapore/2025-10-10/2025-10-17/2/1"
      )
      .expect(200);
    expect(response.body).toStrictEqual(
      "Hello from the backend, running search/hotel/prices endpoint now"
    );
  });

  test("Testing /search/hotel/:hotel_id endpoint, should return a 200 response OK", async () => {
    response = await request(app).get("/search/hotel/diH7").expect(200);
    expect(response.body).toStrictEqual(
      "Hello from the backend, running search/hotel/hotel_id endpoint now"
    );
  });

  test("Testing /search/hotels/images endpoint, should return a 200 response OK", async () => {
    response = await request(app).get("/search/hotels/images").expect(200);
    expect(response.body).toStrictEqual(
      "Hello from the backend, running search/hotels/images endpoint now"
    );
  });

  test("Testing /search/string endpoint, should return a 200 response OK", async () => {
    response = await request(app).get("/search/string/Singapore").expect(200);
    expect(response.body).toStrictEqual(
      "Hello from the backend, running search/string/ endpoint now"
    );
  });
});

describe("(WHITE-BOX UNIT) Testing /search, /search/MainDisplay and /search/AdvancedDisplay implemented error handling", () => {
  beforeEach(() => {
    originalEnv = process.env.INTEGRATION_TEST; // Save original value
    process.env.INTEGRATION_TEST = "true"; // Override for this suite
  });

  afterEach(() => {
    process.env.INTEGRATION_TEST = originalEnv; // Restore original
  });

  test("Testing /search/, Should return error 400 if unable to receive a request from hotel data transfer service unit", async () => {
    const error = new Error("Test error");

    // Mock the service to reject with an error
    hotelDataTransferServiceModule.getAllHotelsAndPricesForDestination = jest
      .fn()
      .mockRejectedValue(error);

    response = await request(app).get(
      "/search/Singapore,_Singapore/2025-10-10/2025-10-17/2/1"
    );
    // Assert
    expect(
      hotelDataTransferServiceModule.getAllHotelsAndPricesForDestination
    ).toHaveBeenCalled();
    expect(response.status).toBe(400);
    expect(response.body.includes("Internal Server Error")).toBe(true);
  });

  test("Testing /search/MainDisplay, Should return error 400 if unable to receive a request from hotel data transfer service unit", async () => {
    const error = new Error("Test error");

    // Mock the service to reject with an error
    hotelDataTransferServiceModule.getAllHotelsAndPricesForDestination = jest
      .fn()
      .mockRejectedValue(error);

    response = await request(app).get(
      "/search/MainDisplay/Singapore,_Singapore/2025-10-10/2025-10-17/2/1"
    );
    // Assert
    expect(
      hotelDataTransferServiceModule.getAllHotelsAndPricesForDestination
    ).toHaveBeenCalled();
    expect(response.status).toBe(400);
    expect(response.body.includes("Internal Server Error")).toBe(true);
  });

  test("Testing /search/AdvancedDisplay, Should return error 400 if unable to receive a request from hotel data transfer service unit", async () => {
    const error = new Error("Test error");

    // Mock the service to reject with an error
    hotelDataTransferServiceModule.getAllHotelsAndPricesForDestination = jest
      .fn()
      .mockRejectedValue(error);

    response = await request(app).get(
      "/search/AdvancedDisplay/Singapore,_Singapore/2025-10-10/2025-10-17/2/1"
    );
    // Assert
    expect(
      hotelDataTransferServiceModule.getAllHotelsAndPricesForDestination
    ).toHaveBeenCalled();
    expect(response.status).toBe(400);
    expect(response.body.includes("Internal Server Error")).toBe(true);
  });
});

describe("(WHITE-BOX UNIT) Testing /search, /search/MainDisplay and /search/AdvancedDisplay", () => {
  beforeEach(() => {
    originalEnv = process.env.INTEGRATION_TEST; // Save original value
    process.env.INTEGRATION_TEST = "true"; // Override for this suite
  });

  afterEach(() => {
    process.env.INTEGRATION_TEST = originalEnv; // Restore original
  });

  test("Testing /search/AdvancedDisplay data ingestion from retrieved Boundary Actor with non null values. Should output all values being initialised", async () => {
    hotelDataTransferServiceModule.getAllHotelsAndPricesForDestination = jest
      .fn()
      .mockResolvedValue(0);

    mockHotelList = [
      {
        keyDetails: {
          id: "obxM",
          imageCount: 100,
          latitude: 1.3122,
          longitude: 103.8606,
          name: "Mercure Singapore Tyrwhitt",
          address: "165 Tyrwhitt Road",
          address1: "165 Tyrwhitt Road",
          checkinTime: "3:00 PM",
          rating: 3,
          distance: 11548.359549931,
          description:
            "Don't miss out on recreational opportunities including an outdoor pool and a fitness center. This hotel also features complimentary wireless internet access, concierge services, and bike parking.\n\nEnjoy a meal at the restaurant or snacks in the hotel's coffee shop/cafe. Quench your thirst with your favorite drink at the bar/lounge. Full breakfasts are available daily from 7 AM to 10:30 AM for a fee.\n\nFeatured amenities include dry cleaning/laundry services, a 24-hour front desk, and multilingual staff. Free self parking is available onsite.\n\nMake yourself at home in one of the 270 air-conditioned rooms featuring LCD televisions. Complimentary wireless internet access keeps you connected, and cable programming is available for your entertainment. Private bathrooms with showers feature complimentary toiletries and hair dryers. Conveniences include safes and desks, as well as phones with free local calls.\n\nDistances are displayed to the nearest 0.1 mile and kilometer. <br /> <p>City Square Mall - 0.5 km / 0.3 mi <br /> Mustafa Centre - 0.7 km / 0.5 mi <br /> Bugis Street Shopping District - 1.2 km / 0.7 mi <br /> Sultan Mosque - 1.4 km / 0.9 mi <br /> Haji Lane - 1.5 km / 0.9 mi <br /> Bugis+ Shopping Center - 1.7 km / 1.1 mi <br /> Bugis Junction Shopping Center - 1.7 km / 1.1 mi <br /> Singapore National Stadium - 2.2 km / 1.4 mi <br /> Singapore Art Museum - 2.2 km / 1.4 mi <br /> Bras Basah Complex - 2.2 km / 1.4 mi <br /> Fort Canning Park - 2.4 km / 1.5 mi <br /> National Museum of Singapore - 2.4 km / 1.5 mi <br /> Suntec City - 2.5 km / 1.5 mi <br /> Suntec Singapore - 2.5 km / 1.6 mi <br /> Mount Elizabeth Novena Hospital - 2.6 km / 1.6 mi <br /> </p><p>The nearest airports are:<br />Seletar Airport (XSP) - 14.4 km / 8.9 mi<br /> Singapore Changi Airport (SIN) - 19.8 km / 12.3 mi<br /> Senai International Airport (JHB) - 72.9 km / 45.3 mi<br /> </p><p></p>\n\nA stay at Mercure Singapore Tyrwhitt places you in the heart of Singapore, within a 15-minute walk of Mustafa Centre and Bugis Street Shopping District.  This hotel is 2.6 mi (4.2 km) from Marina Bay Sands Skypark and 2.7 mi (4.3 km) from Orchard Road.\n\nNear Mustafa Centre",
        },
        amenities: {
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
        },
        imageDetails: {
          imageCounts: [
            "0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48",
          ],
          imageUrlPrefix: "https://d2ey9sqrvkqdfs.cloudfront.net/obxM/",
          imageUrlSuffix: ".jpg",
          stitchedImageUrls: [
            "https://d2ey9sqrvkqdfs.cloudfront.net/obxM/0.jpg",
            "https://d2ey9sqrvkqdfs.cloudfront.net/obxM/1.jpg",
            "https://d2ey9sqrvkqdfs.cloudfront.net/obxM/2.jpg",
            "https://d2ey9sqrvkqdfs.cloudfront.net/obxM/3.jpg",
            "https://d2ey9sqrvkqdfs.cloudfront.net/obxM/4.jpg",
            "https://d2ey9sqrvkqdfs.cloudfront.net/obxM/5.jpg",
            "https://d2ey9sqrvkqdfs.cloudfront.net/obxM/6.jpg",
            "https://d2ey9sqrvkqdfs.cloudfront.net/obxM/7.jpg",
            "https://d2ey9sqrvkqdfs.cloudfront.net/obxM/8.jpg",
            "https://d2ey9sqrvkqdfs.cloudfront.net/obxM/9.jpg",
            "https://d2ey9sqrvkqdfs.cloudfront.net/obxM/10.jpg",
            "https://d2ey9sqrvkqdfs.cloudfront.net/obxM/11.jpg",
            "https://d2ey9sqrvkqdfs.cloudfront.net/obxM/12.jpg",
            "https://d2ey9sqrvkqdfs.cloudfront.net/obxM/13.jpg",
            "https://d2ey9sqrvkqdfs.cloudfront.net/obxM/14.jpg",
            "https://d2ey9sqrvkqdfs.cloudfront.net/obxM/15.jpg",
            "https://d2ey9sqrvkqdfs.cloudfront.net/obxM/16.jpg",
            "https://d2ey9sqrvkqdfs.cloudfront.net/obxM/17.jpg",
            "https://d2ey9sqrvkqdfs.cloudfront.net/obxM/18.jpg",
            "https://d2ey9sqrvkqdfs.cloudfront.net/obxM/19.jpg",
            "https://d2ey9sqrvkqdfs.cloudfront.net/obxM/20.jpg",
            "https://d2ey9sqrvkqdfs.cloudfront.net/obxM/21.jpg",
            "https://d2ey9sqrvkqdfs.cloudfront.net/obxM/22.jpg",
            "https://d2ey9sqrvkqdfs.cloudfront.net/obxM/23.jpg",
            "https://d2ey9sqrvkqdfs.cloudfront.net/obxM/24.jpg",
            "https://d2ey9sqrvkqdfs.cloudfront.net/obxM/25.jpg",
            "https://d2ey9sqrvkqdfs.cloudfront.net/obxM/26.jpg",
            "https://d2ey9sqrvkqdfs.cloudfront.net/obxM/27.jpg",
            "https://d2ey9sqrvkqdfs.cloudfront.net/obxM/28.jpg",
            "https://d2ey9sqrvkqdfs.cloudfront.net/obxM/29.jpg",
            "https://d2ey9sqrvkqdfs.cloudfront.net/obxM/30.jpg",
            "https://d2ey9sqrvkqdfs.cloudfront.net/obxM/31.jpg",
            "https://d2ey9sqrvkqdfs.cloudfront.net/obxM/32.jpg",
            "https://d2ey9sqrvkqdfs.cloudfront.net/obxM/33.jpg",
            "https://d2ey9sqrvkqdfs.cloudfront.net/obxM/34.jpg",
            "https://d2ey9sqrvkqdfs.cloudfront.net/obxM/35.jpg",
            "https://d2ey9sqrvkqdfs.cloudfront.net/obxM/36.jpg",
            "https://d2ey9sqrvkqdfs.cloudfront.net/obxM/37.jpg",
            "https://d2ey9sqrvkqdfs.cloudfront.net/obxM/38.jpg",
            "https://d2ey9sqrvkqdfs.cloudfront.net/obxM/39.jpg",
            "https://d2ey9sqrvkqdfs.cloudfront.net/obxM/40.jpg",
            "https://d2ey9sqrvkqdfs.cloudfront.net/obxM/41.jpg",
            "https://d2ey9sqrvkqdfs.cloudfront.net/obxM/42.jpg",
            "https://d2ey9sqrvkqdfs.cloudfront.net/obxM/43.jpg",
            "https://d2ey9sqrvkqdfs.cloudfront.net/obxM/44.jpg",
            "https://d2ey9sqrvkqdfs.cloudfront.net/obxM/45.jpg",
            "https://d2ey9sqrvkqdfs.cloudfront.net/obxM/46.jpg",
            "https://d2ey9sqrvkqdfs.cloudfront.net/obxM/47.jpg",
            "https://d2ey9sqrvkqdfs.cloudfront.net/obxM/48.jpg",
          ],
        },
        originalMetaData: {
          name: "Mercure Singapore Tyrwhitt",
        },
        pricingRankingData: {
          searchRank: 0.93,
          priceType: "multi",
          freeCancellation: true,
          roomsAvailable: 239952,
          maxCashPayment: 1942.2,
          convertedMaxCashPayment: null,
          points: 63250,
          bonuses: 0,
          bonusPrograms: null,
          bonusTiers: [],
          lowestPrice: 1942.2,
          price: 2530.7,
          convertedPrice: 2530.7,
          lowestConvertedPrice: 2530.7,
          marketRates: [
            {
              supplier: "expedia",
              rate: 2240.446138848,
            },
          ],
        },
        trustYouBenchmark: {
          trustYouId: "51a33b0f-91a4-4c02-963a-2c0155973ccc",
          score: {
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
        },
      },
    ];

    hotelDataTransferServiceModule.hotelDataDTOClassList.getListHotels = jest
      .fn()
      .mockReturnValue(mockHotelList);

    response = await request(app)
      .get(
        "/search/AdvancedDisplay/Singapore,_Singapore/2025-10-10/2025-10-17/2/1"
      )
      .expect(200);

    expectedResponse = [
      {
        name: "Mercure Singapore Tyrwhitt",
        address: "165 Tyrwhitt Road",
        rating: 3,
        description:
          "Don't miss out on recreational opportunities including an outdoor pool and a fitness center. This hotel also features complimentary wireless internet access, concierge services, and bike parking.\n\nEnjoy a meal at the restaurant or snacks in the hotel's coffee shop/cafe. Quench your thirst with your favorite drink at the bar/lounge. Full breakfasts are available daily from 7 AM to 10:30 AM for a fee.\n\nFeatured amenities include dry cleaning/laundry services, a 24-hour front desk, and multilingual staff. Free self parking is available onsite.\n\nMake yourself at home in one of the 270 air-conditioned rooms featuring LCD televisions. Complimentary wireless internet access keeps you connected, and cable programming is available for your entertainment. Private bathrooms with showers feature complimentary toiletries and hair dryers. Conveniences include safes and desks, as well as phones with free local calls.\n\nDistances are displayed to the nearest 0.1 mile and kilometer. <br /> <p>City Square Mall - 0.5 km / 0.3 mi <br /> Mustafa Centre - 0.7 km / 0.5 mi <br /> Bugis Street Shopping District - 1.2 km / 0.7 mi <br /> Sultan Mosque - 1.4 km / 0.9 mi <br /> Haji Lane - 1.5 km / 0.9 mi <br /> Bugis+ Shopping Center - 1.7 km / 1.1 mi <br /> Bugis Junction Shopping Center - 1.7 km / 1.1 mi <br /> Singapore National Stadium - 2.2 km / 1.4 mi <br /> Singapore Art Museum - 2.2 km / 1.4 mi <br /> Bras Basah Complex - 2.2 km / 1.4 mi <br /> Fort Canning Park - 2.4 km / 1.5 mi <br /> National Museum of Singapore - 2.4 km / 1.5 mi <br /> Suntec City - 2.5 km / 1.5 mi <br /> Suntec Singapore - 2.5 km / 1.6 mi <br /> Mount Elizabeth Novena Hospital - 2.6 km / 1.6 mi <br /> </p><p>The nearest airports are:<br />Seletar Airport (XSP) - 14.4 km / 8.9 mi<br /> Singapore Changi Airport (SIN) - 19.8 km / 12.3 mi<br /> Senai International Airport (JHB) - 72.9 km / 45.3 mi<br /> </p><p></p>\n\nA stay at Mercure Singapore Tyrwhitt places you in the heart of Singapore, within a 15-minute walk of Mustafa Centre and Bugis Street Shopping District.  This hotel is 2.6 mi (4.2 km) from Marina Bay Sands Skypark and 2.7 mi (4.3 km) from Orchard Road.\n\nNear Mustafa Centre",
        check_in_time: "3:00 PM",
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
        scores: {
          overall: 86,
          kaligo_overall: 4.3,
          solo: 85,
          couple: 87,
          family: 86,
          business: 80,
        },
        price: 2530.7,
      },
    ];

    expect(response.body).toStrictEqual(expectedResponse);
  });

  test("Testing /search/MainDisplay data ingestion from retrieved Boundary Actor with non null values. Should output all values being initialised.", async () => {
    hotelDataTransferServiceModule.getAllHotelsAndPricesForDestination = jest
      .fn()
      .mockResolvedValue(0);

    mockHotelList = [
      {
        keyDetails: {
          id: "obxM",
          imageCount: 100,
          latitude: 1.3122,
          longitude: 103.8606,
          name: "Mercure Singapore Tyrwhitt",
          address: "165 Tyrwhitt Road",
          address1: "165 Tyrwhitt Road",
          checkinTime: "3:00 PM",
          rating: 3,
          distance: 11548.359549931,
          description:
            "Don't miss out on recreational opportunities including an outdoor pool and a fitness center. This hotel also features complimentary wireless internet access, concierge services, and bike parking.\n\nEnjoy a meal at the restaurant or snacks in the hotel's coffee shop/cafe. Quench your thirst with your favorite drink at the bar/lounge. Full breakfasts are available daily from 7 AM to 10:30 AM for a fee.\n\nFeatured amenities include dry cleaning/laundry services, a 24-hour front desk, and multilingual staff. Free self parking is available onsite.\n\nMake yourself at home in one of the 270 air-conditioned rooms featuring LCD televisions. Complimentary wireless internet access keeps you connected, and cable programming is available for your entertainment. Private bathrooms with showers feature complimentary toiletries and hair dryers. Conveniences include safes and desks, as well as phones with free local calls.\n\nDistances are displayed to the nearest 0.1 mile and kilometer. <br /> <p>City Square Mall - 0.5 km / 0.3 mi <br /> Mustafa Centre - 0.7 km / 0.5 mi <br /> Bugis Street Shopping District - 1.2 km / 0.7 mi <br /> Sultan Mosque - 1.4 km / 0.9 mi <br /> Haji Lane - 1.5 km / 0.9 mi <br /> Bugis+ Shopping Center - 1.7 km / 1.1 mi <br /> Bugis Junction Shopping Center - 1.7 km / 1.1 mi <br /> Singapore National Stadium - 2.2 km / 1.4 mi <br /> Singapore Art Museum - 2.2 km / 1.4 mi <br /> Bras Basah Complex - 2.2 km / 1.4 mi <br /> Fort Canning Park - 2.4 km / 1.5 mi <br /> National Museum of Singapore - 2.4 km / 1.5 mi <br /> Suntec City - 2.5 km / 1.5 mi <br /> Suntec Singapore - 2.5 km / 1.6 mi <br /> Mount Elizabeth Novena Hospital - 2.6 km / 1.6 mi <br /> </p><p>The nearest airports are:<br />Seletar Airport (XSP) - 14.4 km / 8.9 mi<br /> Singapore Changi Airport (SIN) - 19.8 km / 12.3 mi<br /> Senai International Airport (JHB) - 72.9 km / 45.3 mi<br /> </p><p></p>\n\nA stay at Mercure Singapore Tyrwhitt places you in the heart of Singapore, within a 15-minute walk of Mustafa Centre and Bugis Street Shopping District.  This hotel is 2.6 mi (4.2 km) from Marina Bay Sands Skypark and 2.7 mi (4.3 km) from Orchard Road.\n\nNear Mustafa Centre",
        },
        amenities: {
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
        },
        imageDetails: {
          imageCounts: [
            "0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48",
          ],
          imageUrlPrefix: "https://d2ey9sqrvkqdfs.cloudfront.net/obxM/",
          imageUrlSuffix: ".jpg",
          stitchedImageUrls: [
            "https://d2ey9sqrvkqdfs.cloudfront.net/obxM/0.jpg",
            "https://d2ey9sqrvkqdfs.cloudfront.net/obxM/1.jpg",
            "https://d2ey9sqrvkqdfs.cloudfront.net/obxM/2.jpg",
            "https://d2ey9sqrvkqdfs.cloudfront.net/obxM/3.jpg",
            "https://d2ey9sqrvkqdfs.cloudfront.net/obxM/4.jpg",
            "https://d2ey9sqrvkqdfs.cloudfront.net/obxM/5.jpg",
            "https://d2ey9sqrvkqdfs.cloudfront.net/obxM/6.jpg",
            "https://d2ey9sqrvkqdfs.cloudfront.net/obxM/7.jpg",
            "https://d2ey9sqrvkqdfs.cloudfront.net/obxM/8.jpg",
            "https://d2ey9sqrvkqdfs.cloudfront.net/obxM/9.jpg",
            "https://d2ey9sqrvkqdfs.cloudfront.net/obxM/10.jpg",
            "https://d2ey9sqrvkqdfs.cloudfront.net/obxM/11.jpg",
            "https://d2ey9sqrvkqdfs.cloudfront.net/obxM/12.jpg",
            "https://d2ey9sqrvkqdfs.cloudfront.net/obxM/13.jpg",
            "https://d2ey9sqrvkqdfs.cloudfront.net/obxM/14.jpg",
            "https://d2ey9sqrvkqdfs.cloudfront.net/obxM/15.jpg",
            "https://d2ey9sqrvkqdfs.cloudfront.net/obxM/16.jpg",
            "https://d2ey9sqrvkqdfs.cloudfront.net/obxM/17.jpg",
            "https://d2ey9sqrvkqdfs.cloudfront.net/obxM/18.jpg",
            "https://d2ey9sqrvkqdfs.cloudfront.net/obxM/19.jpg",
            "https://d2ey9sqrvkqdfs.cloudfront.net/obxM/20.jpg",
            "https://d2ey9sqrvkqdfs.cloudfront.net/obxM/21.jpg",
            "https://d2ey9sqrvkqdfs.cloudfront.net/obxM/22.jpg",
            "https://d2ey9sqrvkqdfs.cloudfront.net/obxM/23.jpg",
            "https://d2ey9sqrvkqdfs.cloudfront.net/obxM/24.jpg",
            "https://d2ey9sqrvkqdfs.cloudfront.net/obxM/25.jpg",
            "https://d2ey9sqrvkqdfs.cloudfront.net/obxM/26.jpg",
            "https://d2ey9sqrvkqdfs.cloudfront.net/obxM/27.jpg",
            "https://d2ey9sqrvkqdfs.cloudfront.net/obxM/28.jpg",
            "https://d2ey9sqrvkqdfs.cloudfront.net/obxM/29.jpg",
            "https://d2ey9sqrvkqdfs.cloudfront.net/obxM/30.jpg",
            "https://d2ey9sqrvkqdfs.cloudfront.net/obxM/31.jpg",
            "https://d2ey9sqrvkqdfs.cloudfront.net/obxM/32.jpg",
            "https://d2ey9sqrvkqdfs.cloudfront.net/obxM/33.jpg",
            "https://d2ey9sqrvkqdfs.cloudfront.net/obxM/34.jpg",
            "https://d2ey9sqrvkqdfs.cloudfront.net/obxM/35.jpg",
            "https://d2ey9sqrvkqdfs.cloudfront.net/obxM/36.jpg",
            "https://d2ey9sqrvkqdfs.cloudfront.net/obxM/37.jpg",
            "https://d2ey9sqrvkqdfs.cloudfront.net/obxM/38.jpg",
            "https://d2ey9sqrvkqdfs.cloudfront.net/obxM/39.jpg",
            "https://d2ey9sqrvkqdfs.cloudfront.net/obxM/40.jpg",
            "https://d2ey9sqrvkqdfs.cloudfront.net/obxM/41.jpg",
            "https://d2ey9sqrvkqdfs.cloudfront.net/obxM/42.jpg",
            "https://d2ey9sqrvkqdfs.cloudfront.net/obxM/43.jpg",
            "https://d2ey9sqrvkqdfs.cloudfront.net/obxM/44.jpg",
            "https://d2ey9sqrvkqdfs.cloudfront.net/obxM/45.jpg",
            "https://d2ey9sqrvkqdfs.cloudfront.net/obxM/46.jpg",
            "https://d2ey9sqrvkqdfs.cloudfront.net/obxM/47.jpg",
            "https://d2ey9sqrvkqdfs.cloudfront.net/obxM/48.jpg",
          ],
        },
        originalMetaData: {
          name: "Mercure Singapore Tyrwhitt",
        },
        pricingRankingData: {
          searchRank: 0.93,
          priceType: "multi",
          freeCancellation: true,
          roomsAvailable: 239952,
          maxCashPayment: 1942.2,
          convertedMaxCashPayment: null,
          points: 63250,
          bonuses: 0,
          bonusPrograms: null,
          bonusTiers: [],
          lowestPrice: 1942.2,
          price: 2530.7,
          convertedPrice: 2530.7,
          lowestConvertedPrice: 2530.7,
          marketRates: [
            {
              supplier: "expedia",
              rate: 2240.446138848,
            },
          ],
        },
        trustYouBenchmark: {
          trustYouId: "51a33b0f-91a4-4c02-963a-2c0155973ccc",
          score: {
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
        },
      },
    ];

    hotelDataTransferServiceModule.hotelDataDTOClassList.getListHotels = jest
      .fn()
      .mockReturnValue(mockHotelList);

    response = await request(app)
      .get("/search/MainDisplay/Singapore,_Singapore/2025-10-10/2025-10-17/2/1")
      .expect(200);

    expectedResponse = [
      {
        name: "Mercure Singapore Tyrwhitt",
        rating: 3,
        address: "165 Tyrwhitt Road",
      },
    ];

    expect(response.body).toStrictEqual(expectedResponse);
  });

  test("Testing /search/AdvancedDisplay data ingestion from retrieved Boundary Actor with all null values. Should return N/A for all relvant fields.", async () => {
    hotelDataTransferServiceModule.getAllHotelsAndPricesForDestination = jest
      .fn()
      .mockResolvedValue(0);

    mockHotelList = [
      {
        keyDetails: {
          id: "obxM",
          imageCount: 100,
          latitude: 1.3122,
          longitude: 103.8606,
          name: null,
          address: null,
          address1: null,
          checkinTime: null,
          rating: null,
          distance: 11548.359549931,
          description: null,
        },
        amenities: null,
        imageDetails: {
          imageCounts: [
            "0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48",
          ],
          imageUrlPrefix: "https://d2ey9sqrvkqdfs.cloudfront.net/obxM/",
          imageUrlSuffix: ".jpg",
          stitchedImageUrls: [
            "https://d2ey9sqrvkqdfs.cloudfront.net/obxM/0.jpg",
            "https://d2ey9sqrvkqdfs.cloudfront.net/obxM/1.jpg",
            "https://d2ey9sqrvkqdfs.cloudfront.net/obxM/2.jpg",
            "https://d2ey9sqrvkqdfs.cloudfront.net/obxM/3.jpg",
            "https://d2ey9sqrvkqdfs.cloudfront.net/obxM/4.jpg",
            "https://d2ey9sqrvkqdfs.cloudfront.net/obxM/5.jpg",
            "https://d2ey9sqrvkqdfs.cloudfront.net/obxM/6.jpg",
            "https://d2ey9sqrvkqdfs.cloudfront.net/obxM/7.jpg",
            "https://d2ey9sqrvkqdfs.cloudfront.net/obxM/8.jpg",
            "https://d2ey9sqrvkqdfs.cloudfront.net/obxM/9.jpg",
            "https://d2ey9sqrvkqdfs.cloudfront.net/obxM/10.jpg",
            "https://d2ey9sqrvkqdfs.cloudfront.net/obxM/11.jpg",
            "https://d2ey9sqrvkqdfs.cloudfront.net/obxM/12.jpg",
            "https://d2ey9sqrvkqdfs.cloudfront.net/obxM/13.jpg",
            "https://d2ey9sqrvkqdfs.cloudfront.net/obxM/14.jpg",
            "https://d2ey9sqrvkqdfs.cloudfront.net/obxM/15.jpg",
            "https://d2ey9sqrvkqdfs.cloudfront.net/obxM/16.jpg",
            "https://d2ey9sqrvkqdfs.cloudfront.net/obxM/17.jpg",
            "https://d2ey9sqrvkqdfs.cloudfront.net/obxM/18.jpg",
            "https://d2ey9sqrvkqdfs.cloudfront.net/obxM/19.jpg",
            "https://d2ey9sqrvkqdfs.cloudfront.net/obxM/20.jpg",
            "https://d2ey9sqrvkqdfs.cloudfront.net/obxM/21.jpg",
            "https://d2ey9sqrvkqdfs.cloudfront.net/obxM/22.jpg",
            "https://d2ey9sqrvkqdfs.cloudfront.net/obxM/23.jpg",
            "https://d2ey9sqrvkqdfs.cloudfront.net/obxM/24.jpg",
            "https://d2ey9sqrvkqdfs.cloudfront.net/obxM/25.jpg",
            "https://d2ey9sqrvkqdfs.cloudfront.net/obxM/26.jpg",
            "https://d2ey9sqrvkqdfs.cloudfront.net/obxM/27.jpg",
            "https://d2ey9sqrvkqdfs.cloudfront.net/obxM/28.jpg",
            "https://d2ey9sqrvkqdfs.cloudfront.net/obxM/29.jpg",
            "https://d2ey9sqrvkqdfs.cloudfront.net/obxM/30.jpg",
            "https://d2ey9sqrvkqdfs.cloudfront.net/obxM/31.jpg",
            "https://d2ey9sqrvkqdfs.cloudfront.net/obxM/32.jpg",
            "https://d2ey9sqrvkqdfs.cloudfront.net/obxM/33.jpg",
            "https://d2ey9sqrvkqdfs.cloudfront.net/obxM/34.jpg",
            "https://d2ey9sqrvkqdfs.cloudfront.net/obxM/35.jpg",
            "https://d2ey9sqrvkqdfs.cloudfront.net/obxM/36.jpg",
            "https://d2ey9sqrvkqdfs.cloudfront.net/obxM/37.jpg",
            "https://d2ey9sqrvkqdfs.cloudfront.net/obxM/38.jpg",
            "https://d2ey9sqrvkqdfs.cloudfront.net/obxM/39.jpg",
            "https://d2ey9sqrvkqdfs.cloudfront.net/obxM/40.jpg",
            "https://d2ey9sqrvkqdfs.cloudfront.net/obxM/41.jpg",
            "https://d2ey9sqrvkqdfs.cloudfront.net/obxM/42.jpg",
            "https://d2ey9sqrvkqdfs.cloudfront.net/obxM/43.jpg",
            "https://d2ey9sqrvkqdfs.cloudfront.net/obxM/44.jpg",
            "https://d2ey9sqrvkqdfs.cloudfront.net/obxM/45.jpg",
            "https://d2ey9sqrvkqdfs.cloudfront.net/obxM/46.jpg",
            "https://d2ey9sqrvkqdfs.cloudfront.net/obxM/47.jpg",
            "https://d2ey9sqrvkqdfs.cloudfront.net/obxM/48.jpg",
          ],
        },
        originalMetaData: {
          name: "Mercure Singapore Tyrwhitt",
        },
        pricingRankingData: null,
        trustYouBenchmark: {
          trustYouId: "51a33b0f-91a4-4c02-963a-2c0155973ccc",
          score: {
            id: "51a33b0f-91a4-4c02-963a-2c0155973ccc",
            score: {
              overall: null,
              kaligo_overall: null,
              solo: null,
              couple: null,
              family: null,
              business: null,
            },
          },
        },
      },
    ];

    hotelDataTransferServiceModule.hotelDataDTOClassList.getListHotels = jest
      .fn()
      .mockReturnValue(mockHotelList);

    response = await request(app)
      .get(
        "/search/AdvancedDisplay/Singapore,_Singapore/2025-10-10/2025-10-17/2/1"
      )
      .expect(200);

    expectedResponse = [
      {
        name: "N/A",
        address: "N/A",
        rating: "N/A",
        description: "N/A",
        check_in_time: "N/A",
        amenities: {},
        scores: {
          overall: "N/A",
          kaligo_overall: "N/A",
          solo: "N/A",
          couple: "N/A",
          family: "N/A",
          business: "N/A",
        },
        price: "N/A",
      },
    ];

    expect(response.body).toStrictEqual(expectedResponse);
  });

  test("Testing /search/MainDisplay data ingestion from retrieved Boundary Actor with all null values. Should return N/A for all relvant fields.", async () => {
    hotelDataTransferServiceModule.getAllHotelsAndPricesForDestination = jest
      .fn()
      .mockResolvedValue(0);

    mockHotelList = [
      {
        keyDetails: {
          id: "obxM",
          imageCount: 100,
          latitude: 1.3122,
          longitude: 103.8606,
          name: null,
          address: null,
          address1: null,
          checkinTime: null,
          rating: null,
          distance: 11548.359549931,
          description: null,
        },
        amenities: null,
        imageDetails: {
          imageCounts: [
            "0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48",
          ],
          imageUrlPrefix: "https://d2ey9sqrvkqdfs.cloudfront.net/obxM/",
          imageUrlSuffix: ".jpg",
          stitchedImageUrls: [
            "https://d2ey9sqrvkqdfs.cloudfront.net/obxM/0.jpg",
            "https://d2ey9sqrvkqdfs.cloudfront.net/obxM/1.jpg",
            "https://d2ey9sqrvkqdfs.cloudfront.net/obxM/2.jpg",
            "https://d2ey9sqrvkqdfs.cloudfront.net/obxM/3.jpg",
            "https://d2ey9sqrvkqdfs.cloudfront.net/obxM/4.jpg",
            "https://d2ey9sqrvkqdfs.cloudfront.net/obxM/5.jpg",
            "https://d2ey9sqrvkqdfs.cloudfront.net/obxM/6.jpg",
            "https://d2ey9sqrvkqdfs.cloudfront.net/obxM/7.jpg",
            "https://d2ey9sqrvkqdfs.cloudfront.net/obxM/8.jpg",
            "https://d2ey9sqrvkqdfs.cloudfront.net/obxM/9.jpg",
            "https://d2ey9sqrvkqdfs.cloudfront.net/obxM/10.jpg",
            "https://d2ey9sqrvkqdfs.cloudfront.net/obxM/11.jpg",
            "https://d2ey9sqrvkqdfs.cloudfront.net/obxM/12.jpg",
            "https://d2ey9sqrvkqdfs.cloudfront.net/obxM/13.jpg",
            "https://d2ey9sqrvkqdfs.cloudfront.net/obxM/14.jpg",
            "https://d2ey9sqrvkqdfs.cloudfront.net/obxM/15.jpg",
            "https://d2ey9sqrvkqdfs.cloudfront.net/obxM/16.jpg",
            "https://d2ey9sqrvkqdfs.cloudfront.net/obxM/17.jpg",
            "https://d2ey9sqrvkqdfs.cloudfront.net/obxM/18.jpg",
            "https://d2ey9sqrvkqdfs.cloudfront.net/obxM/19.jpg",
            "https://d2ey9sqrvkqdfs.cloudfront.net/obxM/20.jpg",
            "https://d2ey9sqrvkqdfs.cloudfront.net/obxM/21.jpg",
            "https://d2ey9sqrvkqdfs.cloudfront.net/obxM/22.jpg",
            "https://d2ey9sqrvkqdfs.cloudfront.net/obxM/23.jpg",
            "https://d2ey9sqrvkqdfs.cloudfront.net/obxM/24.jpg",
            "https://d2ey9sqrvkqdfs.cloudfront.net/obxM/25.jpg",
            "https://d2ey9sqrvkqdfs.cloudfront.net/obxM/26.jpg",
            "https://d2ey9sqrvkqdfs.cloudfront.net/obxM/27.jpg",
            "https://d2ey9sqrvkqdfs.cloudfront.net/obxM/28.jpg",
            "https://d2ey9sqrvkqdfs.cloudfront.net/obxM/29.jpg",
            "https://d2ey9sqrvkqdfs.cloudfront.net/obxM/30.jpg",
            "https://d2ey9sqrvkqdfs.cloudfront.net/obxM/31.jpg",
            "https://d2ey9sqrvkqdfs.cloudfront.net/obxM/32.jpg",
            "https://d2ey9sqrvkqdfs.cloudfront.net/obxM/33.jpg",
            "https://d2ey9sqrvkqdfs.cloudfront.net/obxM/34.jpg",
            "https://d2ey9sqrvkqdfs.cloudfront.net/obxM/35.jpg",
            "https://d2ey9sqrvkqdfs.cloudfront.net/obxM/36.jpg",
            "https://d2ey9sqrvkqdfs.cloudfront.net/obxM/37.jpg",
            "https://d2ey9sqrvkqdfs.cloudfront.net/obxM/38.jpg",
            "https://d2ey9sqrvkqdfs.cloudfront.net/obxM/39.jpg",
            "https://d2ey9sqrvkqdfs.cloudfront.net/obxM/40.jpg",
            "https://d2ey9sqrvkqdfs.cloudfront.net/obxM/41.jpg",
            "https://d2ey9sqrvkqdfs.cloudfront.net/obxM/42.jpg",
            "https://d2ey9sqrvkqdfs.cloudfront.net/obxM/43.jpg",
            "https://d2ey9sqrvkqdfs.cloudfront.net/obxM/44.jpg",
            "https://d2ey9sqrvkqdfs.cloudfront.net/obxM/45.jpg",
            "https://d2ey9sqrvkqdfs.cloudfront.net/obxM/46.jpg",
            "https://d2ey9sqrvkqdfs.cloudfront.net/obxM/47.jpg",
            "https://d2ey9sqrvkqdfs.cloudfront.net/obxM/48.jpg",
          ],
        },
        originalMetaData: {
          name: "Mercure Singapore Tyrwhitt",
        },
        pricingRankingData: null,
        trustYouBenchmark: {
          trustYouId: "51a33b0f-91a4-4c02-963a-2c0155973ccc",
          score: {
            id: "51a33b0f-91a4-4c02-963a-2c0155973ccc",
            score: {
              overall: null,
              kaligo_overall: null,
              solo: null,
              couple: null,
              family: null,
              business: null,
            },
          },
        },
      },
    ];

    hotelDataTransferServiceModule.hotelDataDTOClassList.getListHotels = jest
      .fn()
      .mockReturnValue(mockHotelList);

    response = await request(app)
      .get("/search/MainDisplay/Singapore,_Singapore/2025-10-10/2025-10-17/2/1")
      .expect(200);

    expectedResponse = [
      {
        name: "N/A",
        rating: "N/A",
        address: "N/A",
      },
    ];

    expect(response.body).toStrictEqual(expectedResponse);
  });
});

describe("(BLACK-BOX UNIT) Testing destination and hotel search endpoints, with valid and invalid request parameters.", () => {
  beforeAll(() => {
    originalEnv = process.env.INTEGRATION_TEST; // Save original value
    process.env.INTEGRATION_TEST = "true"; // Override for this suite
  });

  afterAll(() => {
    process.env.INTEGRATION_TEST = originalEnv; // Restore original
  });

  test("testing /search, Invalid parameters", async () => {
    response = await request(app).get(
      "/search/Singapore,_Singapore/ejdoejofe/2025-10-17/2/1"
    ); //invalid checkin
    response2 = await request(app).get(
      "/search/Singapore,_Singapore/2020-10-11/202ieifehfi/2/1"
    ); //invalid checkout

    expect(response.status).toBe(400);
    expect(response.body).toStrictEqual("Invalid check-in/out date");

    expect(response2.status).toBe(400);
    expect(response2.body).toStrictEqual("Invalid check-in/out date");

    response5 = await request(app).get(
      "/search/Singapore,_Singapore/2025-10-17/2025-10-11/2/1"
    );

    response6 = await request(app).get(
      "/search/Singapore,_Singapore/2025-12-11/2025-10-17/2/1"
    );

    response7 = await request(app).get(
      "/search/Singapore,_Singapore/2026-10-11/2025-10-17/2/1"
    );

    expect(response5.status).toBe(400);
    expect(response5.body).toStrictEqual(
      "Check in date is greater than checkout"
    );

    expect(response6.status).toBe(400);
    expect(response6.body).toStrictEqual(
      "Check in date is greater than checkout"
    );

    expect(response7.status).toBe(400);
    expect(response7.body).toStrictEqual(
      "Check in date is greater than checkout"
    );

    response3 = await request(app).get(
      "/search/Singapore,_Singapore/2025-10-11/2025-10-17/a/1"
    );
    response4 = await request(app).get(
      "/search/Singapore,_Singapore/2020-10-11/2020-10-17/2/bfjefjj4ogj4g4g"
    );

    expect(response3.status).toBe(400);
    expect(response3.body).toStrictEqual(
      "Invalid guest/room count data types."
    );

    expect(response4.status).toBe(400);
    expect(response4.body).toStrictEqual(
      "Invalid guest/room count data types."
    );
  });

  test("testing /search/AdvancedDisplay, Invalid parameters", async () => {
    response = await request(app).get(
      "/search/Singapore,_Singapore/ejdoejofe/2025-10-17/2/1"
    ); //invalid checkin
    response2 = await request(app).get(
      "/search/AdvancedDisplay/Singapore,_Singapore/2020-10-11/202ieifehfi/2/1"
    ); //invalid checkout

    expect(response.status).toBe(400);
    expect(response.body).toStrictEqual("Invalid check-in/out date");

    expect(response2.status).toBe(400);
    expect(response2.body).toStrictEqual("Invalid check-in/out date");

    response5 = await request(app).get(
      "/search/AdvancedDisplay/Singapore,_Singapore/2025-10-17/2025-10-11/2/1"
    );

    response6 = await request(app).get(
      "/search/AdvancedDisplay/Singapore,_Singapore/2025-12-11/2025-10-17/2/1"
    );

    response7 = await request(app).get(
      "/search/AdvancedDisplay/Singapore,_Singapore/2026-10-11/2025-10-17/2/1"
    );

    expect(response5.status).toBe(400);
    expect(response5.body).toStrictEqual(
      "Check in date is greater than checkout"
    );

    expect(response6.status).toBe(400);
    expect(response6.body).toStrictEqual(
      "Check in date is greater than checkout"
    );

    expect(response7.status).toBe(400);
    expect(response7.body).toStrictEqual(
      "Check in date is greater than checkout"
    );

    response3 = await request(app).get(
      "/search/AdvancedDisplay/Singapore,_Singapore/2025-10-11/2025-10-17/a/1"
    );
    response4 = await request(app).get(
      "/search/AdvancedDisplay/Singapore,_Singapore/2025-10-11/2025-10-17/2/bfjefjj4ogj4g4g"
    );

    expect(response3.status).toBe(400);
    expect(response3.body).toStrictEqual(
      "Invalid guest/room count data types."
    );

    expect(response4.status).toBe(400);
    expect(response4.body).toStrictEqual(
      "Invalid guest/room count data types."
    );
  });

  test("testing /search/MainDisplay, Invalid parameters", async () => {
    response = await request(app).get(
      "/search/MainDisplay/Singapore,_Singapore/ejdoejofe/2025-10-17/2/1"
    ); //invalid checkin
    response2 = await request(app).get(
      "/search/MainDisplay/Singapore,_Singapore/2025-10-11/202ieifehfi/2/1"
    ); //invalid checkout

    expect(response.status).toBe(400);
    expect(response.body).toStrictEqual("Invalid check-in/out date");

    expect(response2.status).toBe(400);
    expect(response2.body).toStrictEqual("Invalid check-in/out date");

    response5 = await request(app).get(
      "/search/MainDisplay/Singapore,_Singapore/2025-10-17/2025-10-11/2/1"
    );

    response6 = await request(app).get(
      "/search/MainDisplay/Singapore,_Singapore/2025-12-11/2025-10-17/2/1"
    );

    response7 = await request(app).get(
      "/search/MainDisplay/Singapore,_Singapore/2026-10-11/2025-10-17/2/1"
    );

    expect(response5.status).toBe(400);
    expect(response5.body).toStrictEqual(
      "Check in date is greater than checkout"
    );

    expect(response6.status).toBe(400);
    expect(response6.body).toStrictEqual(
      "Check in date is greater than checkout"
    );

    expect(response7.status).toBe(400);
    expect(response7.body).toStrictEqual(
      "Check in date is greater than checkout"
    );

    response3 = await request(app).get(
      "/search/MainDisplay/Singapore,_Singapore/2025-10-11/2025-10-17/a/1"
    );
    response4 = await request(app).get(
      "/search/MainDisplay/Singapore,_Singapore/2025-10-11/2025-10-17/2/bfjefjj4ogj4g4g"
    );

    expect(response3.status).toBe(400);
    expect(response3.body).toStrictEqual(
      "Invalid guest/room count data types."
    );

    expect(response4.status).toBe(400);
    expect(response4.body).toStrictEqual(
      "Invalid guest/room count data types."
    );
  });

  test("testing /search/hotel/prices, Invalid parameters", async () => {
    response = await request(app).get(
      "/search/hotel/prices/diH7/RsBU/20-10-11/2025-10-17/2/1"
    ); //invalid checkin
    response2 = await request(app).get(
      "/search/hotel/prices/diH7/RsBU/2025-10-11/20fjie17/2/1"
    ); //invalid checkout

    expect(response.status).toBe(400);

    expect(response2.status).toBe(400);

    response5 = await request(app).get(
      "/search/hotel/prices/diH7/RsBU/2026-10-11/2025-10-17/2/1"
    );

    response6 = await request(app).get(
      "/search/hotel/prices/diH7/RsBU/2025-12-11/2025-10-17/2/1"
    );

    response7 = await request(app).get(
      "/search/hotel/prices/diH7/RsBU/2025-10-20/2025-10-17/2/1"
    );

    expect(response5.status).toBe(400);
    expect(response5.body).toStrictEqual(
      "Check in date is greater than checkout"
    );

    expect(response6.status).toBe(400);
    expect(response6.body).toStrictEqual(
      "Check in date is greater than checkout"
    );

    expect(response7.status).toBe(400);
    expect(response7.body).toStrictEqual(
      "Check in date is greater than checkout"
    );

    response3 = await request(app).get(
      "/search/hotel/prices/diH7/RsBU/2025-10-11/2025-10-17/eded/1"
    );
    response4 = await request(app).get(
      "/search/hotel/prices/diH7/RsBU/2025-10-11/2025-10-17/2/uuui"
    );

    expect(response3.status).toBe(400);
    expect(response3.body).toStrictEqual(
      "Invalid guest/room count data types."
    );

    expect(response4.status).toBe(400);
    expect(response4.body).toStrictEqual(
      "Invalid guest/room count data types."
    );
  });
});

describe("(BLACK BOX UNIT) Testing the string fuzzy search /search/string/:searchLiteral endpoint, with invalid parameters", () => {
  beforeAll(() => {
    originalEnv = process.env.INTEGRATION_TEST; // Save original value
    process.env.INTEGRATION_TEST = "true"; // Override for this suite
  });

  afterAll(() => {
    process.env.INTEGRATION_TEST = originalEnv; // Restore original
  });
  test("testing with invalid search parameters, not of the format set (<search string>, <search string>)", async () => {
    response = await request(app).get("/search/string/oirio34foi3");
    expect(response.status).toBe(400);
    expect(response.body).toStrictEqual("Invalid search format");
  });
});

describe("General Fuzzing of all API prompt parameters", () => {
  beforeAll(() => {
    originalEnv = process.env.INTEGRATION_TEST; // Save original value
    process.env.INTEGRATION_TEST = "true"; // Override for this suite
  });

  afterAll(() => {
    process.env.INTEGRATION_TEST = originalEnv; // Restore original
  });

  const urlSafeChars =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_={}][\\/><.,?`|_.~";

  const urlSafeString = fc
    .array(fc.constantFrom(...urlSafeChars), { minLength: 1, maxLength: 10 })
    .map((arr) => arr.join(""));

  numRuns = 20;

  test("/search/ should return HTTP 200-404 for wide input range", async () => {
    await fc.assert(
      fc.asyncProperty(urlSafeString, async (data) => {
        const response = await request(app).get(
          `/search/Singapore,_Singapore/${data}/${data}/${data}/${data}`
        );
        expect(response.status).toBeGreaterThanOrEqual(200);
        expect(response.status).toBeLessThanOrEqual(404);
      }),
      { numRuns: 10, verbose: true }
    );
  });

  test("/search/MainDisplay should return HTTP 200-404 for wide input range", async () => {
    await fc.assert(
      fc.asyncProperty(urlSafeString, async (data) => {
        const response = await request(app).get(
          `/search/MainDisplay/Singapore,_Singapore/${data}/${data}/${data}/${data}`
        );
        expect(response.status).toBeGreaterThanOrEqual(200);
        expect(response.status).toBeLessThanOrEqual(404);
      }),
      { numRuns: numRuns, verbose: true }
    );
  });

  test("/search/AdvancedDisplay should return HTTP 200-404 for wide input range", async () => {
    await fc.assert(
      fc.asyncProperty(urlSafeString, async (data) => {
        const response = await request(app).get(
          `/search/AdvancedDisplay/Singapore,_Singapore/${data}/${data}/${data}/${data}`
        );
        expect(response.status).toBeGreaterThanOrEqual(200);
        expect(response.status).toBeLessThanOrEqual(404);
      }),
      { numRuns: numRuns, verbose: true }
    );
  });

  test("/search/hotel/prices should return HTTP 200-404 for wide input range", async () => {
    await fc.assert(
      fc.asyncProperty(urlSafeString, async (data) => {
        const response = await request(app).get(
          `/search/hotel/prices/diH7/RsBU/${data}/${data}/${data}/${data}`
        );
        expect(response.status).toBeGreaterThanOrEqual(200);
        expect(response.status).toBeLessThanOrEqual(404);
      }),
      { numRuns: numRuns, verbose: true }
    );
  });

  test("/search/string/:searchLiteral should return HTTP 200-404 for wide input range", async () => {
    const urlSafeChars =
      "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_={}][\\/><.,?`|_.~";

    const urlSafeString = fc
      .array(fc.constantFrom(...urlSafeChars), { minLength: 1, maxLength: 20 })
      .map((arr) => arr.join(""));

    await fc.assert(
      fc.asyncProperty(urlSafeString, async (data) => {
        const response = await request(app).get(`/search/string/${data}`);
        expect(response.status).toBeGreaterThanOrEqual(200);
        expect(response.status).toBeLessThanOrEqual(404);
      }),
      { numRuns: numRuns, verbose: true }
    );
  }, 120000);
});
