const request = require("supertest");
const app = require("../../server");
const hotelDataDTOService = require("../../hotel_data/hotel_data_service");

const jwt = require("jsonwebtoken");

process.env.INTEGRATION_TEST = "true";
process.env.NODE_ENV = "test";

//Integration tests for destination search
describe("(GREY-BOX INTEGRATION) GET /search/ (Main API route to initialise all variables for HotelDTO)", () => {
  jest.setTimeout(60000);

  jest.mock("../../models/destinations", () => ({
    insertFromJSON: jest.fn(() => console.log("Mocked insertFromJSON")),
  }));

  beforeEach(() => {
    global.fetch = jest.fn();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  test("Should return partial data without pricing details if price API is unavailable.", async () => {
    const requestBody = {
      destination_name: "Singapore,_Singapore",
      check_in_date: "2025-10-11",
      check_out_date: "2025-10-17",
      language: "en_US",
      currency: "SGD",
      guest_count: "2",
      room_count: "2",
    };

    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: () =>
        Promise.resolve([
          {
            id: "050G",
            imageCount: 62,
            latitude: 1.318685,
            longitude: 103.847882,
            name: "ST Residences Novena",
            address: "145A Moulmein Road",
            address1: "145A Moulmein Road",
            rating: 4,
            distance: 11546.941685574,
            trustyou: {
              id: "dede9a48-2f7c-49ae-9bd0-942a40e245e7",
              score: {
                overall: 85,
                kaligo_overall: 4.3,
                solo: 80,
                couple: 86,
                family: 80,
                business: null,
              },
            },
            categories: {
              overall: {
                name: "Overall",
                score: 94,
                popularity: 4,
              },
              romantic_hotel: {
                name: "Romantic Hotel",
                score: 72,
                popularity: 8.61548461538462,
              },
              family_hotel: {
                name: "Family Hotel",
                score: 75,
                popularity: 11.2643140468227,
              },
              business_hotel: {
                name: "Business Hotel",
                score: 85,
                popularity: 23.8462538461539,
              },
            },
            amenities_ratings: [
              {
                name: "Food",
                score: 100,
              },
              {
                name: "WiFi",
                score: 100,
              },
              {
                name: "Service",
                score: 99,
              },
              {
                name: "Amenities",
                score: 98,
              },
              {
                name: "Location",
                score: 97,
              },
              {
                name: "Comfort",
                score: 92,
              },
              {
                name: "Breakfast",
                score: 80,
              },
              {
                name: "Room",
                score: 79,
              },
            ],
            description:
              "Take advantage of recreation opportunities including an outdoor pool and a 24-hour fitness center. Additional amenities at this aparthotel include complimentary wireless internet access, concierge services, and a communal living room.\n\nFeatured amenities include dry cleaning/laundry services, a 24-hour front desk, and luggage storage. Free self parking is available onsite.\n\nMake yourself at home in one of the 38 individually furnished guestrooms, featuring kitchenettes with refrigerators and microwaves. 40-inch LED televisions with cable programming provide entertainment, while complimentary wireless internet access keeps you connected. Conveniences include safes and desks, and housekeeping is provided weekly.\n\nDistances are displayed to the nearest 0.1 mile and kilometer. \u003Cbr /\u003E \u003Cp\u003EMount Elizabeth Novena Hospital - 0.7 km / 0.4 mi \u003Cbr /\u003E City Square Mall - 1.5 km / 0.9 mi \u003Cbr /\u003E Mustafa Centre - 1.6 km / 1 mi \u003Cbr /\u003E The Paragon - 2.5 km / 1.6 mi \u003Cbr /\u003E Bugis Street Shopping District - 2.6 km / 1.6 mi \u003Cbr /\u003E Mount Elizabeth Medical Center - 2.6 km / 1.6 mi \u003Cbr /\u003E Orchard Road - 2.6 km / 1.6 mi \u003Cbr /\u003E Takashimaya Shopping Centre - 2.7 km / 1.7 mi \u003Cbr /\u003E Orchard Central - 2.8 km / 1.7 mi \u003Cbr /\u003E Haji Lane - 2.8 km / 1.8 mi \u003Cbr /\u003E Sultan Mosque - 2.8 km / 1.8 mi \u003Cbr /\u003E Lucky Plaza - 2.9 km / 1.8 mi \u003Cbr /\u003E Bugis+ Shopping Center - 2.9 km / 1.8 mi \u003Cbr /\u003E Orchard Tower - 3 km / 1.8 mi \u003Cbr /\u003E Bugis Junction Shopping Center - 3 km / 1.8 mi \u003Cbr /\u003E \u003C/p\u003E\u003Cp\u003EThe nearest airports are:\u003Cbr /\u003ESeletar Airport (XSP) - 13.7 km / 8.5 mi\u003Cbr /\u003E Singapore Changi Airport (SIN) - 21.4 km / 13.3 mi\u003Cbr /\u003E Senai International Airport (JHB) - 71 km / 44.1 mi\u003Cbr /\u003E \u003C/p\u003E\u003Cp\u003E\u003C/p\u003E\n\nWith a stay at ST Residences Novena, you'll be centrally located in Singapore, within a 5-minute drive of Orchard Road and Mustafa Centre.  This boutique aparthotel is 3.3 mi (5.3 km) from Marina Bay Sands Skypark and 3.6 mi (5.8 km) from Marina Bay Sands Casino.\n\nIn Singapore (Novena)",
            amenities: {
              airConditioning: true,
              clothingIron: true,
              continentalBreakfast: true,
              dataPorts: true,
              hairDryer: true,
              kitchen: true,
              outdoorPool: true,
              parkingGarage: true,
              safe: true,
              tVInRoom: true,
              voiceMail: true,
            },
            original_metadata: {
              name: null,
              city: "Singapore",
              state: null,
              country: "SG",
            },
            image_details: {
              suffix: ".jpg",
              count: 62,
              prefix: "https://d2ey9sqrvkqdfs.cloudfront.net/050G/",
            },
            hires_image_index:
              "0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51",
            number_of_images: 54,
            default_image_index: 1,
            imgix_url: "https://kaligo-web-expedia.imgix.net",
            cloudflare_image_url: "https://www.kaligo-staging.xyz/images/new",
            checkin_time: "3:00 PM",
          },
        ]),
    });

    //Price data unavailable. So we simulate the 4 calls in the while loop, each returning the same empty response
    global.fetch
      .mockResolvedValueOnce({
        // First call
        ok: true,
        json: () =>
          Promise.resolve({
            searchCompleted: null,
            completed: false,
            status: null,
            currency: null,
            hotels: [],
          }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: () =>
          Promise.resolve({
            searchCompleted: null,
            completed: false,
            status: null,
            currency: null,
            hotels: [],
          }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: () =>
          Promise.resolve({
            searchCompleted: null,
            completed: false,
            status: null,
            currency: null,
            hotels: [],
          }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: () =>
          Promise.resolve({
            searchCompleted: null,
            completed: false,
            status: null,
            currency: null,
            hotels: [],
          }),
      });

    const response = await request(app)
      .get(
        `/search/${requestBody.destination_name}/${requestBody.check_in_date}/${requestBody.check_out_date}/${requestBody.guest_count}/${requestBody.room_count}`
      )
      .expect(200); //Expect a 200 Status OK

    expect(Array.isArray(response.body.hotelList)).toBe(true);

    response.body.hotelList.forEach((jsonHotelBody) => {
      expect(jsonHotelBody).toHaveProperty("keyDetails");
      expect(jsonHotelBody).toHaveProperty("originalMetaData");
      expect(jsonHotelBody).toHaveProperty("trustYouBenchmark");
      expect(jsonHotelBody).toHaveProperty("amenities");
      expect(jsonHotelBody).toHaveProperty("imageDetails");
    });

    const expectedFirstResource = {
      keyDetails: {
        id: "050G",
        imageCount: 62,
        latitude: 1.318685,
        longitude: 103.847882,
        name: "ST Residences Novena",
        address: "145A Moulmein Road",
        address1: "145A Moulmein Road",
        checkinTime: "3:00 PM",
        rating: 4,
        distance: 11546.94168557398,
        description:
          "Take advantage of recreation opportunities including an outdoor pool and a 24-hour fitness center. Additional amenities at this aparthotel include complimentary wireless internet access, concierge services, and a communal living room.\n\nFeatured amenities include dry cleaning/laundry services, a 24-hour front desk, and luggage storage. Free self parking is available onsite.\n\nMake yourself at home in one of the 38 individually furnished guestrooms, featuring kitchenettes with refrigerators and microwaves. 40-inch LED televisions with cable programming provide entertainment, while complimentary wireless internet access keeps you connected. Conveniences include safes and desks, and housekeeping is provided weekly.\n\nDistances are displayed to the nearest 0.1 mile and kilometer. <br /> <p>Mount Elizabeth Novena Hospital - 0.7 km / 0.4 mi <br /> City Square Mall - 1.5 km / 0.9 mi <br /> Mustafa Centre - 1.6 km / 1 mi <br /> The Paragon - 2.5 km / 1.6 mi <br /> Bugis Street Shopping District - 2.6 km / 1.6 mi <br /> Mount Elizabeth Medical Center - 2.6 km / 1.6 mi <br /> Orchard Road - 2.6 km / 1.6 mi <br /> Takashimaya Shopping Centre - 2.7 km / 1.7 mi <br /> Orchard Central - 2.8 km / 1.7 mi <br /> Haji Lane - 2.8 km / 1.8 mi <br /> Sultan Mosque - 2.8 km / 1.8 mi <br /> Lucky Plaza - 2.9 km / 1.8 mi <br /> Bugis+ Shopping Center - 2.9 km / 1.8 mi <br /> Orchard Tower - 3 km / 1.8 mi <br /> Bugis Junction Shopping Center - 3 km / 1.8 mi <br /> </p><p>The nearest airports are:<br />Seletar Airport (XSP) - 13.7 km / 8.5 mi<br /> Singapore Changi Airport (SIN) - 21.4 km / 13.3 mi<br /> Senai International Airport (JHB) - 71 km / 44.1 mi<br /> </p><p></p>\n\nWith a stay at ST Residences Novena, you'll be centrally located in Singapore, within a 5-minute drive of Orchard Road and Mustafa Centre.  This boutique aparthotel is 3.3 mi (5.3 km) from Marina Bay Sands Skypark and 3.6 mi (5.8 km) from Marina Bay Sands Casino.\n\nIn Singapore (Novena)",
      },
      amenities: {
        amenities: {
          airConditioning: true,
          clothingIron: true,
          continentalBreakfast: true,
          dataPorts: true,
          hairDryer: true,
          kitchen: true,
          outdoorPool: true,
          parkingGarage: true,
          safe: true,
          tVInRoom: true,
          voiceMail: true,
        },
      },
      imageDetails: {
        imageCounts: [
          "0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51",
        ],
        imageUrlPrefix: "https://d2ey9sqrvkqdfs.cloudfront.net/050G/",
        imageUrlSuffix: ".jpg",
        stitchedImageUrls: [
          "https://d2ey9sqrvkqdfs.cloudfront.net/050G/0.jpg",
          "https://d2ey9sqrvkqdfs.cloudfront.net/050G/1.jpg",
          "https://d2ey9sqrvkqdfs.cloudfront.net/050G/2.jpg",
          "https://d2ey9sqrvkqdfs.cloudfront.net/050G/3.jpg",
          "https://d2ey9sqrvkqdfs.cloudfront.net/050G/4.jpg",
          "https://d2ey9sqrvkqdfs.cloudfront.net/050G/5.jpg",
          "https://d2ey9sqrvkqdfs.cloudfront.net/050G/6.jpg",
          "https://d2ey9sqrvkqdfs.cloudfront.net/050G/7.jpg",
          "https://d2ey9sqrvkqdfs.cloudfront.net/050G/8.jpg",
          "https://d2ey9sqrvkqdfs.cloudfront.net/050G/9.jpg",
          "https://d2ey9sqrvkqdfs.cloudfront.net/050G/10.jpg",
          "https://d2ey9sqrvkqdfs.cloudfront.net/050G/11.jpg",
          "https://d2ey9sqrvkqdfs.cloudfront.net/050G/12.jpg",
          "https://d2ey9sqrvkqdfs.cloudfront.net/050G/13.jpg",
          "https://d2ey9sqrvkqdfs.cloudfront.net/050G/14.jpg",
          "https://d2ey9sqrvkqdfs.cloudfront.net/050G/15.jpg",
          "https://d2ey9sqrvkqdfs.cloudfront.net/050G/16.jpg",
          "https://d2ey9sqrvkqdfs.cloudfront.net/050G/17.jpg",
          "https://d2ey9sqrvkqdfs.cloudfront.net/050G/18.jpg",
          "https://d2ey9sqrvkqdfs.cloudfront.net/050G/19.jpg",
          "https://d2ey9sqrvkqdfs.cloudfront.net/050G/20.jpg",
          "https://d2ey9sqrvkqdfs.cloudfront.net/050G/21.jpg",
          "https://d2ey9sqrvkqdfs.cloudfront.net/050G/22.jpg",
          "https://d2ey9sqrvkqdfs.cloudfront.net/050G/23.jpg",
          "https://d2ey9sqrvkqdfs.cloudfront.net/050G/24.jpg",
          "https://d2ey9sqrvkqdfs.cloudfront.net/050G/25.jpg",
          "https://d2ey9sqrvkqdfs.cloudfront.net/050G/26.jpg",
          "https://d2ey9sqrvkqdfs.cloudfront.net/050G/27.jpg",
          "https://d2ey9sqrvkqdfs.cloudfront.net/050G/28.jpg",
          "https://d2ey9sqrvkqdfs.cloudfront.net/050G/29.jpg",
          "https://d2ey9sqrvkqdfs.cloudfront.net/050G/30.jpg",
          "https://d2ey9sqrvkqdfs.cloudfront.net/050G/31.jpg",
          "https://d2ey9sqrvkqdfs.cloudfront.net/050G/32.jpg",
          "https://d2ey9sqrvkqdfs.cloudfront.net/050G/33.jpg",
          "https://d2ey9sqrvkqdfs.cloudfront.net/050G/34.jpg",
          "https://d2ey9sqrvkqdfs.cloudfront.net/050G/35.jpg",
          "https://d2ey9sqrvkqdfs.cloudfront.net/050G/36.jpg",
          "https://d2ey9sqrvkqdfs.cloudfront.net/050G/37.jpg",
          "https://d2ey9sqrvkqdfs.cloudfront.net/050G/38.jpg",
          "https://d2ey9sqrvkqdfs.cloudfront.net/050G/39.jpg",
          "https://d2ey9sqrvkqdfs.cloudfront.net/050G/40.jpg",
          "https://d2ey9sqrvkqdfs.cloudfront.net/050G/41.jpg",
          "https://d2ey9sqrvkqdfs.cloudfront.net/050G/42.jpg",
          "https://d2ey9sqrvkqdfs.cloudfront.net/050G/43.jpg",
          "https://d2ey9sqrvkqdfs.cloudfront.net/050G/44.jpg",
          "https://d2ey9sqrvkqdfs.cloudfront.net/050G/45.jpg",
          "https://d2ey9sqrvkqdfs.cloudfront.net/050G/46.jpg",
          "https://d2ey9sqrvkqdfs.cloudfront.net/050G/47.jpg",
          "https://d2ey9sqrvkqdfs.cloudfront.net/050G/48.jpg",
          "https://d2ey9sqrvkqdfs.cloudfront.net/050G/49.jpg",
          "https://d2ey9sqrvkqdfs.cloudfront.net/050G/50.jpg",
          "https://d2ey9sqrvkqdfs.cloudfront.net/050G/51.jpg",
        ],
      },
      originalMetaData: {
        name: "ST Residences Novena",
      },
      pricingRankingData: null,
      trustYouBenchmark: {
        trustYouId: "dede9a48-2f7c-49ae-9bd0-942a40e245e7",
        score: {
          id: "dede9a48-2f7c-49ae-9bd0-942a40e245e7",
          score: {
            overall: 85,
            kaligo_overall: 4.3,
            solo: 80,
            couple: 86,
            family: 80,
            business: null,
          },
        },
      },
    };

    expect(response.body.hotelList)[0] = expectedFirstResource;
  });

  test("Should return a 400 server error if the retrieved data is null, and exceeding maximum of 4 fetch attempts.", async () => {
    const requestBody = {
      destination_name: "Singapore,_Singapore",
      check_in_date: "2025-10-11",
      check_out_date: "2025-10-17",
      language: "en_US",
      currency: "SGD",
      guest_count: "2",
      room_count: "2",
    };

    hotelDataDTOService.hotelDataDTOClassList.setCurrentSearchDestinationName(
      null
    );

    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve([]),
    });

    //Price data unavailable
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: () =>
        Promise.resolve({
          searchCompleted: null,
          completed: false,
          status: null,
          currency: null,
          hotels: [],
        }),
    });

    const response = await request(app)
      .get(
        `/search/${requestBody.destination_name}/${requestBody.check_in_date}/${requestBody.check_out_date}/${requestBody.guest_count}/${requestBody.room_count}`
      )
      .expect(400); //Expect a 200 Status OK
  });

  test("Should return entire suite of data if both destination and prices API by Ascenda are working.", async () => {
    const requestBody = {
      destination_name: "Singapore,_Singapore",
      check_in_date: "2025-10-11",
      check_out_date: "2025-10-17",
      language: "en_US",
      currency: "SGD",
      guest_count: "2",
      room_count: "2",
    };

    console.log("testing last one...");

    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: () =>
        Promise.resolve([
          {
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
          },
        ]),
    });

    global.fetch
      .mockResolvedValueOnce({
        // First call
        ok: true,
        json: () =>
          Promise.resolve({
            searchCompleted: null,
            completed: false,
            status: null,
            currency: null,
            hotels: [],
          }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: () =>
          Promise.resolve({
            searchCompleted: null,
            completed: false,
            status: null,
            currency: null,
            hotels: [],
          }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: () =>
          Promise.resolve({
            searchCompleted: null,
            completed: false,
            status: null,
            currency: null,
            hotels: [],
          }),
      })
      .mockResolvedValueOnce({
        //finally succeeds on last call
        ok: true,
        json: () =>
          Promise.resolve({
            searchCompleted: null,
            completed: false,
            status: null,
            currency: null,
            hotels: [
              {
                id: "obxM",
                searchRank: 0.93,
                price_type: "multi",
                free_cancellation: true,
                rooms_available: 19992,
                max_cash_payment: 2313.59,
                coverted_max_cash_payment: 3014.63,
                points: 75350,
                bonuses: 0,
                bonus_programs: [],
                bonus_tiers: [],
                lowest_price: 2313.59,
                price: 3014.63,
                converted_price: 3014.63,
                lowest_converted_price: 3014.63,
                market_rates: [
                  {
                    supplier: "expedia",
                    rate: 2668.849503624,
                  },
                ],
              },
            ],
          }),
      });

    const response = await request(app)
      .get(
        `/search/${requestBody.destination_name}/${requestBody.check_in_date}/${requestBody.check_out_date}/${requestBody.guest_count}/${requestBody.room_count}`
      )
      .expect(200); //Expect a 200 Status OK

    expect(Array.isArray(response.body.hotelList)).toBe(true);

    response.body.hotelList.forEach((jsonHotelBody) => {
      expect(jsonHotelBody).toHaveProperty("keyDetails");
      expect(jsonHotelBody).toHaveProperty("originalMetaData");
      expect(jsonHotelBody).toHaveProperty("trustYouBenchmark");
      expect(jsonHotelBody).toHaveProperty("pricingRankingData");
      expect(jsonHotelBody).toHaveProperty("amenities");
      expect(jsonHotelBody).toHaveProperty("imageDetails");
    });

    expectedFirstResource = {
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
    };

    expect(response.body.hotelList)[0] = expectedFirstResource;
  });
});

describe("(BLACK-BOX INTEGRATION) GET /search/images (API to return the images of all the hotels for a given destination)", () => {
  jest.setTimeout(60000);

  beforeEach(() => {
    global.fetch = jest.fn();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  test("Should return the images for the list of hotels.", async () => {
    const response = await request(app).get("/search/images").expect(200);

    expectOneResource = {
      obxM: [
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
    };

    expect(response.body).toEqual(expect.objectContaining(expectOneResource));
  });
});

//Integration tests for user login and register
const db = require("../../models/db");

//Testing user.js /login and /register routes
//Steps:
//1. Try to login with a user credentials which do not exist in the database (should return 401 unauthorized)
//2. Register with the same credentials (should return 200)
//3. Login again with now registered credentials (should return 200)
//4. Clear test values from database
describe("(BLACK-BOX INTEGRATION) Testing user registration and login", () => {
  async function createTestDbTable() {
    try {
      // for simplicity, we assume staff names are uniqe (in the absence of NRIC or personal email)
      await db.pool.query(`
          CREATE TABLE IF NOT EXISTS USER_TEST_TABLE (
              id INTEGER AUTO_INCREMENT PRIMARY KEY,
              email VARCHAR(255),
              password VARCHAR(255)
          )
          `);
      console.log("Test database initialised for tests");
    } catch (error) {
      console.error("database connection failed. ", error);
      throw error;
    }
  }

  async function teardownDatabaseValues() {
    try {
      db.pool.query(`
			DROP TABLE IF EXISTS USER_TEST_TABLE
			`);
    } catch (error) {
      console.error("database connection failed", error);
      throw error;
    }
  }

  //Make sure no stray values in database for testing purposes.

  beforeAll(async () => {
    while (!db.verifyConnection()) {
      console.log("Verifying db connection...");
    }
  });

  beforeAll(async () => {
    return await createTestDbTable();
  });

  requestBody = {
    email: "testinguser@gmail.com",
    password: "testingPassword",
  };

  test("Logging in with unregistered user details. Should return an error 401 unauthorised.", async () => {
    await request(app).post("/auth/login").send(requestBody).expect(401);
  });

  test("Registering with user details not already existing in the database. Should proceed with 200 OK.", async () => {
    await request(app).post("/auth/register").send(requestBody).expect(200);
  });

  test("Logging in with the newly registered user, should now return 200 OK.", async () => {
    await request(app).post("/auth/login").send(requestBody).expect(200);
  });

  afterAll(async () => {
    await teardownDatabaseValues();
    console.log("Test database cleared.");
  });
});

//Integration tests for hotel room data retrieval
//Testing Hotel room details listing
describe("(GREY-BOX INTEGRATION) GET /search/hotel/prices (API to return the room details for a specific hotel)", () => {
  test("Should return entire suite of data if the API is working, simulated after 3 tries of fetch failure.", async () => {
    global.fetch
      .mockResolvedValueOnce({
        ok: true,
        json: () =>
          Promise.resolve({
            searchCompleted: null,
            completed: true,
            status: null,
            currency: null,
            rooms: [],
          }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: () =>
          Promise.resolve({
            searchCompleted: null,
            completed: true,
            status: null,
            currency: null,
            rooms: [],
          }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: () =>
          Promise.resolve({
            searchCompleted: null,
            completed: true,
            status: null,
            currency: null,
            rooms: [],
          }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: () =>
          Promise.resolve({
            searchCompleted: null,
            completed: true,
            status: null,
            currency: null,
            rooms: [
              {
                key: "4e3ccfc3-00ab-5d88-8bab-cece629e67ce",
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
              },
            ],
          }),
      });

    expectedOutput = {
      keyRoomDetails: {
        keyId: "4e3ccfc3-00ab-5d88-8bab-cece629e67ce",
        roomDescription: "Double room",
        roomTypeIndex: "1",
        freeCancellation: false,
        longDescription: null,
      },
      priceDetails: {
        description: "Double room",
        priceType: "single",
        maxCashPayment: 4173.84,
        points: 136250,
        bonusPrograms: [],
        bonusTiers: [],
        lowestPrice: 4173.84,
        price: 5450.23,
        convertedPrice: 5450.23,
        lowestConvertedPrice: 5450.23,
        chargeableRate: 4173.84,
        marketRates: [
          {
            supplier: "expedia",
            rate: 4710.611242034396,
          },
        ],
      },
      taxDetails: {
        baseRate: 3629.43,
        baseRateInCurrency: 4739.34,
        includedTaxesFeesTotal: 544.41,
        includedTaxesFeesTotalInCurrency: 710.9,
        excludedTaxesFeesTotal: 0,
        excludedTaxesFeesTotalInCurrency: 0,
        includedTaxesFeesDetails: [
          {
            id: "tax_and_service_fee",
            amount: 544.41,
            currency: "USD",
          },
        ],
        includedTaxesFeesInCurrencyDetails: [
          {
            id: "tax_and_service_fee",
            amount: 710.9,
            currency: "SGD",
          },
        ],
        excludedTaxesFeesInCurrencyDetails: null,
        excludedTaxesFeesDetails: null,
      },
      roomAdditionalInfo: {
        breakfastInfo: "hotel_detail_room_only",
        specialCheckInInstructions: null,
        knowBeforeYouGo: null,
        optionalFees: null,
        mandatoryFees: null,
        kaligoServiceFee: 0,
        hotelFees: [],
        surcharges: [
          {
            type: "TaxAndServiceFee",
            amount: 544.41,
          },
        ],
      },
    };

    requestParameters = {
      hotel_id: "diH7",
      destination_id: "WD0M",
      check_in_date: "2025-10-10",
      check_out_date: "2025-10-17",
      guest_count: "2",
      room_count: "1",
    };

    const response = await request(app)
      .get(
        `/search/hotel/prices/${requestParameters.hotel_id}/${requestParameters.destination_id}/${requestParameters.check_in_date}/${requestParameters.check_out_date}/${requestParameters.guest_count}/${requestParameters.room_count}`
      )
      .expect(200);

    expect(response)[0] = expectedOutput;
  });

  test("Should return error 400 if the API is unavailable, after exceeding maximum fetch attempts of 4 tries.", async () => {
    global.fetch
      .mockResolvedValueOnce({
        ok: true,
        json: () =>
          Promise.resolve({
            searchCompleted: null,
            completed: true,
            status: null,
            currency: null,
            rooms: [],
          }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: () =>
          Promise.resolve({
            searchCompleted: null,
            completed: true,
            status: null,
            currency: null,
            rooms: [],
          }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: () =>
          Promise.resolve({
            searchCompleted: null,
            completed: true,
            status: null,
            currency: null,
            rooms: [],
          }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: () =>
          Promise.resolve({
            searchCompleted: null,
            completed: true,
            status: null,
            currency: null,
            rooms: [],
          }),
      });

    response = await request(app)
      .get(
        `/search/hotel/prices/${requestParameters.hotel_id}/${requestParameters.destination_id}/${requestParameters.check_in_date}/${requestParameters.check_out_date}/${requestParameters.guest_count}/${requestParameters.room_count}`
      )
      .expect(400);
  });
});

//Integration Tests for Bookmark feature
const verifyToken = require("../../auth_middleware/auth_middleware");

// Mock JWT verify function
jest.mock("jsonwebtoken", () => ({
  verify: jest.fn(),
}));

// Mock auth middleware
jest.mock("../../auth_middleware/auth_middleware", () => {
  return jest.fn((req, res, next) => {
    req.userId = "test-user-id";
    next();
  });
});

beforeEach(() => {
  jest.clearAllMocks();
  // Setup JWT verification to succeed
  jwt.verify.mockImplementation(() => ({ userId: "test-user-id" }));
});

describe("(GREY-BOX INTEGRATION) POST /auth/bookmarks (API to insert a hotel bookmark", () => {
  //Create a test db table for these tests
  async function createTestDbTable() {
    try {
      // for simplicity, we assume staff names are uniqe (in the absence of NRIC or personal email)
      await db.pool.query(`
          CREATE TABLE IF NOT EXISTS BOOKMARK_TEST_TABLE (
              id INTEGER AUTO_INCREMENT,
              hotel_id VARCHAR(255),
              hotel_name VARCHAR(255),
              hotel_address VARCHAR(255),
              image_url VARCHAR(255),
              hotel_ratings VARCHAR(255),
              user_email VARCHAR(255),
              destination_id VARCHAR (255),
              search_string VARCHAR (255),
              PRIMARY KEY (id, hotel_id)
          )
          `);
      console.log("Test database initialised for tests");
    } catch (error) {
      console.error("database connection failed. ", error);
      throw error;
    }
  }

  async function teardownDatabaseValues() {
    try {
      db.pool.query(`
			DROP TABLE IF EXISTS BOOKMARK_TEST_TABLE
			`);
    } catch (error) {
      console.error("database connection failed", error);
      throw error;
    }
  }

  //Make sure no stray values in database for testing purposes.

  beforeAll(async () => {
    while (!db.verifyConnection()) {
      console.log("Verifying db connection...");
    }
  });

  beforeAll(async () => {
    return await createTestDbTable();
  });

  // Setup before each test
  beforeEach(() => {
    // Reset all mocks
    jest.clearAllMocks();

    // Setup JWT mock
    jwt.verify.mockReturnValue({ userId: "test-user-id" });

    // Setup auth middleware mock
    verifyToken.mockImplementation((req, res, next) => {
      req.userId = "test-user-id";
      next();
    });
  });

  test("If the key value pair of (hotel, user email) is not present in the database, means that hotel is not yet included in user's bookmarks. Should add it to database.", async () => {
    testrequestData = {
      hotel_id: "DIH7",
      hotel_name: "The Fillerton Hutel",
      hotel_address: "One Waffles Place",
      image_url: "http://abc.jpg",
      hotel_ratings: "1",
      user_email: "jhonnyboy@gmail.com",
      search_string: "search/xyz/destination=abc",
      destination_id: "RsBU",
    };

    await request(app)
      .post("/auth/bookmarks/")
      .set("Authorization", "Bearer fake-token")
      .send(testrequestData)
      .expect(200);
  });

  test("Now hotel data is present in database. Should return 200 if same current user tries to bookmark it again, and send message that hotel is already bookmarked", async () => {
    testrequestData = {
      hotel_id: "DIH7",
      hotel_name: "The Fillerton Hutel",
      hotel_address: "One Waffles Place",
      image_url: "http://abc.jpg",
      hotel_ratings: "1",
      user_email: "jhonnyboy@gmail.com",
      search_string: "search/xyz/destination=abc",
      destination_id: "RsBU",
    };

    await request(app)
      .post("/auth/bookmarks")
      .set("Authorization", "Bearer fake-token")
      .send(testrequestData)
      .expect(200);
  });

  test("Now, logged in as a different user. Bookmarking the same hotel but since value pair of (hotel, user email) does not yet exist for this new user, this user should be able to bookmark the hotel", async () => {
    testrequestData = {
      hotel_id: "DIH7",
      hotel_name: "The Fillerton Hutel",
      hotel_address: "One Waffles Place",
      image_url: "http://abc.jpg",
      hotel_ratings: "1",
      user_email: "jennygirl@gmail.com",
      search_string: "search/xyz/destination=abc",
      destination_id: "RsBU",
    };

    await request(app)
      .post("/auth/bookmarks")
      .set("Authorization", "Bearer fake-token")
      .send(testrequestData)
      .expect(200);
  });

  afterAll(async () => {
    await teardownDatabaseValues();
  });
});

describe("(GREY BOX INTEGRATION) GET /auth/AllBookmarks (API to return all of the bookmarked hotels registered under one user's email", () => {
  async function createTestDbTable() {
    try {
      // for simplicity, we assume staff names are uniqe (in the absence of NRIC or personal email)
      await db.pool.query(`
          CREATE TABLE IF NOT EXISTS BOOKMARK_TEST_TABLE (
              id INTEGER AUTO_INCREMENT,
              hotel_id VARCHAR(255),
              hotel_name VARCHAR(255),
              hotel_address VARCHAR(255),
              image_url VARCHAR(255),
              hotel_ratings VARCHAR(255),
              user_email VARCHAR(255),
              destination_id VARCHAR (255),
              search_string VARCHAR (255),
              PRIMARY KEY (id, hotel_id)
          )
          `);
      console.log("Test database initialised for tests");
    } catch (error) {
      console.error("database connection failed. ", error);
      throw error;
    }
  }

  async function teardownDatabaseValues() {
    try {
      db.pool.query(`
			DROP TABLE IF EXISTS BOOKMARK_TEST_TABLE
			`);
    } catch (error) {
      console.error("database connection failed", error);
      throw error;
    }
  }

  //Make sure no stray values in database for testing purposes.

  beforeAll(async () => {
    while (!db.verifyConnection()) {
      console.log("Verifying db connection...");
    }
  });

  beforeAll(async () => {
    return await createTestDbTable();
  });

  test("If a user has bookmarked a number of hotels, should return all of them registered under his/her email", async () => {
    testrequestData = {
      hotel_id: "DIH7",
      hotel_name: "The Fillerton Hutel",
      hotel_address: "One Waffles Place",
      image_url: "http://abc.jpg",
      hotel_ratings: "1",
      user_email: "jennygirl@gmail.com",
      search_string: "search/xyz/destination=abc",
      destination_id: "RsBU",
    };
    testrequestData1 = {
      hotel_id: "WD0M",
      hotel_name: "The Fillertoni Hutol",
      hotel_address: "One Waffles Area",
      image_url: "http://abc.jpg",
      hotel_ratings: "1",
      user_email: "jennygirl@gmail.com",
      search_string: "search/xyz/destination=abc",
      destination_id: "RsBU",
    };
    testrequestData2 = {
      hotel_id: "RXBI",
      hotel_name: "The Follerton Hitel",
      hotel_address: "One Pancake Place",
      image_url: "http://abc.jpg",
      hotel_ratings: "1",
      user_email: "jennygirl@gmail.com",
      search_string: "search/xyz/destination=abc",
      destination_id: "RsBU",
    };
    testrequestData3 = {
      hotel_id: "RFI0",
      hotel_name: "The Fillertini Hatel",
      hotel_address: "One Fried Place",
      image_url: "http://abc.jpg",
      hotel_ratings: "1",
      user_email: "jennygirl@gmail.com",
      search_string: "search/xyz/destination=abc",
      destination_id: "RsBU",
    };
    testrequestData4 = {
      hotel_id: "IP04",
      hotel_name: "The Fallerten's Hetel",
      hotel_address: "One Shit Place",
      image_url: "http://abc.jpg",
      hotel_ratings: "1",
      user_email: "jennygirl@gmail.com",
      search_string: "search/xyz/destination=abc",
      destination_id: "RsBU",
    };

    //Above integration test for adding unique hotel bookmarks for the same user should pass before this.
    await request(app)
      .post("/auth/bookmarks")
      .set("Authorization", "Bearer fake-token")
      .send(testrequestData)
      .expect(200);

    await request(app)
      .post("/auth/bookmarks")
      .set("Authorization", "Bearer fake-token")
      .send(testrequestData1)
      .expect(200);

    await request(app)
      .post("/auth/bookmarks")
      .set("Authorization", "Bearer fake-token")
      .send(testrequestData2)
      .expect(200);

    await request(app)
      .post("/auth/bookmarks")
      .set("Authorization", "Bearer fake-token")
      .send(testrequestData3)
      .expect(200);

    await request(app)
      .post("/auth/bookmarks")
      .set("Authorization", "Bearer fake-token")
      .send(testrequestData4)
      .expect(200);

    expectedOutput = [
      {
        hotel_id: "DIH7",
        hotel_name: "The Fillerton Hutel",
        hotel_address: "One Waffles Place",
        image_url: "http://abc.jpg",
        hotel_ratings: "1",
        user_email: "jennygirl@gmail.com",
        search_string: "search/xyz/destination=abc",
        destination_id: "RsBU",
      },
      {
        hotel_id: "WD0M",
        hotel_name: "The Fillertoni Hutol",
        hotel_address: "One Waffles Area",
        image_url: "http://abc.jpg",
        hotel_ratings: "1",
        user_email: "jennygirl@gmail.com",
        search_string: "search/xyz/destination=abc",
        destination_id: "RsBU",
      },
      {
        hotel_id: "RXBI",
        hotel_name: "The Follerton Hitel",
        hotel_address: "One Pancake Place",
        image_url: "http://abc.jpg",
        hotel_ratings: "1",
        user_email: "jennygirl@gmail.com",
        search_string: "search/xyz/destination=abc",
        destination_id: "RsBU",
      },
      {
        hotel_id: "RFI0",
        hotel_name: "The Fillertini Hatel",
        hotel_address: "One Fried Place",
        image_url: "http://abc.jpg",
        hotel_ratings: "1",
        user_email: "jennygirl@gmail.com",
        search_string: "search/xyz/destination=abc",
        destination_id: "RsBU",
      },
      {
        hotel_id: "IP04",
        hotel_name: "The Fallerten's Hetel",
        hotel_address: "One Shit Place",
        image_url: "http://abc.jpg",
        hotel_ratings: "1",
        user_email: "jennygirl@gmail.com",
        search_string: "search/xyz/destination=abc",
        destination_id: "RsBU",
      },
    ];

    const result = await request(app)
      .get(`/auth/allBookmarks/${testrequestData.user_email}`)
      .set("Authorization", "Bearer fake-token")
      .expect(200);
    expect(result.body).toStrictEqual(expectedOutput);
  });

  afterAll(async () => {
    await teardownDatabaseValues();
  });
});
