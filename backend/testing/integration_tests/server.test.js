const request = require("supertest");
const app = require("../../server");
const hotelDataDTOService = require("../../hotel_data/hotel_data_service");
const { json } = require("express");

//import database model

describe("GET localhost:8080/search/ (Main API route to initialise all variables for HotelDTO)", () => {
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

  test("Should return a partial data without pricing details is price API is unavailable", async () => {
    const requestBody = {
      destination_name: "Singapore,_Singapore",
      check_in_date: "25-10-11",
      check_out_date: "25-10-17",
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

    expect(Array.isArray(response.body)).toBe(true);

    response.body.forEach((jsonHotelBody) => {
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
        imageCounts: 62,
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
          "https://d2ey9sqrvkqdfs.cloudfront.net/050G/52.jpg",
          "https://d2ey9sqrvkqdfs.cloudfront.net/050G/53.jpg",
          "https://d2ey9sqrvkqdfs.cloudfront.net/050G/54.jpg",
          "https://d2ey9sqrvkqdfs.cloudfront.net/050G/55.jpg",
          "https://d2ey9sqrvkqdfs.cloudfront.net/050G/56.jpg",
          "https://d2ey9sqrvkqdfs.cloudfront.net/050G/57.jpg",
          "https://d2ey9sqrvkqdfs.cloudfront.net/050G/58.jpg",
          "https://d2ey9sqrvkqdfs.cloudfront.net/050G/59.jpg",
          "https://d2ey9sqrvkqdfs.cloudfront.net/050G/60.jpg",
          "https://d2ey9sqrvkqdfs.cloudfront.net/050G/61.jpg",
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

    expect(response.body)[0] = expectedFirstResource;
  });

  test("Should return a 500 server error if the retrieved data is null, and that data has not been initialied beforehand", async () => {
    const requestBody = {
      destination_name: "Singapore,_Singapore",
      check_in_date: "25-10-11",
      check_out_date: "25-10-17",
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
      .expect(500); //Expect a 200 Status OK
  });

  test("Should return entire suite of data, if prices API is working", async () => {
    const requestBody = {
      destination_name: "Singapore,_Singapore",
      check_in_date: "25-10-11",
      check_out_date: "25-10-17",
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

    expect(Array.isArray(response.body)).toBe(true);

    response.body.forEach((jsonHotelBody) => {
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
        imageCounts: 100,
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
          "https://d2ey9sqrvkqdfs.cloudfront.net/obxM/49.jpg",
          "https://d2ey9sqrvkqdfs.cloudfront.net/obxM/50.jpg",
          "https://d2ey9sqrvkqdfs.cloudfront.net/obxM/51.jpg",
          "https://d2ey9sqrvkqdfs.cloudfront.net/obxM/52.jpg",
          "https://d2ey9sqrvkqdfs.cloudfront.net/obxM/53.jpg",
          "https://d2ey9sqrvkqdfs.cloudfront.net/obxM/54.jpg",
          "https://d2ey9sqrvkqdfs.cloudfront.net/obxM/55.jpg",
          "https://d2ey9sqrvkqdfs.cloudfront.net/obxM/56.jpg",
          "https://d2ey9sqrvkqdfs.cloudfront.net/obxM/57.jpg",
          "https://d2ey9sqrvkqdfs.cloudfront.net/obxM/58.jpg",
          "https://d2ey9sqrvkqdfs.cloudfront.net/obxM/59.jpg",
          "https://d2ey9sqrvkqdfs.cloudfront.net/obxM/60.jpg",
          "https://d2ey9sqrvkqdfs.cloudfront.net/obxM/61.jpg",
          "https://d2ey9sqrvkqdfs.cloudfront.net/obxM/62.jpg",
          "https://d2ey9sqrvkqdfs.cloudfront.net/obxM/63.jpg",
          "https://d2ey9sqrvkqdfs.cloudfront.net/obxM/64.jpg",
          "https://d2ey9sqrvkqdfs.cloudfront.net/obxM/65.jpg",
          "https://d2ey9sqrvkqdfs.cloudfront.net/obxM/66.jpg",
          "https://d2ey9sqrvkqdfs.cloudfront.net/obxM/67.jpg",
          "https://d2ey9sqrvkqdfs.cloudfront.net/obxM/68.jpg",
          "https://d2ey9sqrvkqdfs.cloudfront.net/obxM/69.jpg",
          "https://d2ey9sqrvkqdfs.cloudfront.net/obxM/70.jpg",
          "https://d2ey9sqrvkqdfs.cloudfront.net/obxM/71.jpg",
          "https://d2ey9sqrvkqdfs.cloudfront.net/obxM/72.jpg",
          "https://d2ey9sqrvkqdfs.cloudfront.net/obxM/73.jpg",
          "https://d2ey9sqrvkqdfs.cloudfront.net/obxM/74.jpg",
          "https://d2ey9sqrvkqdfs.cloudfront.net/obxM/75.jpg",
          "https://d2ey9sqrvkqdfs.cloudfront.net/obxM/76.jpg",
          "https://d2ey9sqrvkqdfs.cloudfront.net/obxM/77.jpg",
          "https://d2ey9sqrvkqdfs.cloudfront.net/obxM/78.jpg",
          "https://d2ey9sqrvkqdfs.cloudfront.net/obxM/79.jpg",
          "https://d2ey9sqrvkqdfs.cloudfront.net/obxM/80.jpg",
          "https://d2ey9sqrvkqdfs.cloudfront.net/obxM/81.jpg",
          "https://d2ey9sqrvkqdfs.cloudfront.net/obxM/82.jpg",
          "https://d2ey9sqrvkqdfs.cloudfront.net/obxM/83.jpg",
          "https://d2ey9sqrvkqdfs.cloudfront.net/obxM/84.jpg",
          "https://d2ey9sqrvkqdfs.cloudfront.net/obxM/85.jpg",
          "https://d2ey9sqrvkqdfs.cloudfront.net/obxM/86.jpg",
          "https://d2ey9sqrvkqdfs.cloudfront.net/obxM/87.jpg",
          "https://d2ey9sqrvkqdfs.cloudfront.net/obxM/88.jpg",
          "https://d2ey9sqrvkqdfs.cloudfront.net/obxM/89.jpg",
          "https://d2ey9sqrvkqdfs.cloudfront.net/obxM/90.jpg",
          "https://d2ey9sqrvkqdfs.cloudfront.net/obxM/91.jpg",
          "https://d2ey9sqrvkqdfs.cloudfront.net/obxM/92.jpg",
          "https://d2ey9sqrvkqdfs.cloudfront.net/obxM/93.jpg",
          "https://d2ey9sqrvkqdfs.cloudfront.net/obxM/94.jpg",
          "https://d2ey9sqrvkqdfs.cloudfront.net/obxM/95.jpg",
          "https://d2ey9sqrvkqdfs.cloudfront.net/obxM/96.jpg",
          "https://d2ey9sqrvkqdfs.cloudfront.net/obxM/97.jpg",
          "https://d2ey9sqrvkqdfs.cloudfront.net/obxM/98.jpg",
          "https://d2ey9sqrvkqdfs.cloudfront.net/obxM/99.jpg",
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

    expect(response.body)[0] = expectedFirstResource;
  });
});

describe("GET localhost:8080/search/images (API to return the images of all the hotels for a given destination", () => {
  jest.setTimeout(60000);

  beforeEach(() => {
    global.fetch = jest.fn();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  test("Should return the images for the list of hotels, after running the above main API, with complete suite of data retrieved", async () => {
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
        "https://d2ey9sqrvkqdfs.cloudfront.net/obxM/49.jpg",
        "https://d2ey9sqrvkqdfs.cloudfront.net/obxM/50.jpg",
        "https://d2ey9sqrvkqdfs.cloudfront.net/obxM/51.jpg",
        "https://d2ey9sqrvkqdfs.cloudfront.net/obxM/52.jpg",
        "https://d2ey9sqrvkqdfs.cloudfront.net/obxM/53.jpg",
        "https://d2ey9sqrvkqdfs.cloudfront.net/obxM/54.jpg",
        "https://d2ey9sqrvkqdfs.cloudfront.net/obxM/55.jpg",
        "https://d2ey9sqrvkqdfs.cloudfront.net/obxM/56.jpg",
        "https://d2ey9sqrvkqdfs.cloudfront.net/obxM/57.jpg",
        "https://d2ey9sqrvkqdfs.cloudfront.net/obxM/58.jpg",
        "https://d2ey9sqrvkqdfs.cloudfront.net/obxM/59.jpg",
        "https://d2ey9sqrvkqdfs.cloudfront.net/obxM/60.jpg",
        "https://d2ey9sqrvkqdfs.cloudfront.net/obxM/61.jpg",
        "https://d2ey9sqrvkqdfs.cloudfront.net/obxM/62.jpg",
        "https://d2ey9sqrvkqdfs.cloudfront.net/obxM/63.jpg",
        "https://d2ey9sqrvkqdfs.cloudfront.net/obxM/64.jpg",
        "https://d2ey9sqrvkqdfs.cloudfront.net/obxM/65.jpg",
        "https://d2ey9sqrvkqdfs.cloudfront.net/obxM/66.jpg",
        "https://d2ey9sqrvkqdfs.cloudfront.net/obxM/67.jpg",
        "https://d2ey9sqrvkqdfs.cloudfront.net/obxM/68.jpg",
        "https://d2ey9sqrvkqdfs.cloudfront.net/obxM/69.jpg",
        "https://d2ey9sqrvkqdfs.cloudfront.net/obxM/70.jpg",
        "https://d2ey9sqrvkqdfs.cloudfront.net/obxM/71.jpg",
        "https://d2ey9sqrvkqdfs.cloudfront.net/obxM/72.jpg",
        "https://d2ey9sqrvkqdfs.cloudfront.net/obxM/73.jpg",
        "https://d2ey9sqrvkqdfs.cloudfront.net/obxM/74.jpg",
        "https://d2ey9sqrvkqdfs.cloudfront.net/obxM/75.jpg",
        "https://d2ey9sqrvkqdfs.cloudfront.net/obxM/76.jpg",
        "https://d2ey9sqrvkqdfs.cloudfront.net/obxM/77.jpg",
        "https://d2ey9sqrvkqdfs.cloudfront.net/obxM/78.jpg",
        "https://d2ey9sqrvkqdfs.cloudfront.net/obxM/79.jpg",
        "https://d2ey9sqrvkqdfs.cloudfront.net/obxM/80.jpg",
        "https://d2ey9sqrvkqdfs.cloudfront.net/obxM/81.jpg",
        "https://d2ey9sqrvkqdfs.cloudfront.net/obxM/82.jpg",
        "https://d2ey9sqrvkqdfs.cloudfront.net/obxM/83.jpg",
        "https://d2ey9sqrvkqdfs.cloudfront.net/obxM/84.jpg",
        "https://d2ey9sqrvkqdfs.cloudfront.net/obxM/85.jpg",
        "https://d2ey9sqrvkqdfs.cloudfront.net/obxM/86.jpg",
        "https://d2ey9sqrvkqdfs.cloudfront.net/obxM/87.jpg",
        "https://d2ey9sqrvkqdfs.cloudfront.net/obxM/88.jpg",
        "https://d2ey9sqrvkqdfs.cloudfront.net/obxM/89.jpg",
        "https://d2ey9sqrvkqdfs.cloudfront.net/obxM/90.jpg",
        "https://d2ey9sqrvkqdfs.cloudfront.net/obxM/91.jpg",
        "https://d2ey9sqrvkqdfs.cloudfront.net/obxM/92.jpg",
        "https://d2ey9sqrvkqdfs.cloudfront.net/obxM/93.jpg",
        "https://d2ey9sqrvkqdfs.cloudfront.net/obxM/94.jpg",
        "https://d2ey9sqrvkqdfs.cloudfront.net/obxM/95.jpg",
        "https://d2ey9sqrvkqdfs.cloudfront.net/obxM/96.jpg",
        "https://d2ey9sqrvkqdfs.cloudfront.net/obxM/97.jpg",
        "https://d2ey9sqrvkqdfs.cloudfront.net/obxM/98.jpg",
        "https://d2ey9sqrvkqdfs.cloudfront.net/obxM/99.jpg",
      ],
    };

    expect(response.body).toEqual(expect.objectContaining(expectOneResource));
  });
});

const db = require("../../models/db");

//Testing user.js /login and /register routes
//Steps:
//1. Try to login with a user credentials which do not exist in the database (should return 401 unauthorized)
//2. Register with the same credentials (should return 200)
//3. Login again with now registered credentials (should return 200)
//4. Clear test values from database
describe("Testing user registration and login", () => {
  async function createTestDbTable() {
    try {
      // for simplicity, we assume staff names are uniqe (in the absence of NRIC or personal email)
      db.pool.query(`
          CREATE TABLE IF NOT EXISTS USER_TEST_TABLE (
              id INTEGER AUTO_INCREMENT PRIMARY KEY,
              email VARCHAR(255),
              password VARCHAR(255)
          )
          `);
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
    await createTestDbTable();
    console.log("Test database initialised for tests");
  });

  requestBody = {
    email: "testingUser@gmail.com",
    password: "testingPassword",
  };

  test("Logging in with unregistered user details. Should return an error", async () => {
    await request(app).post("/auth/login").send(requestBody).expect(401);
  });

  test("Registering with user details not already existing in the database", async () => {
    await request(app).post("/auth/register").send(requestBody).expect(200);
  });

  test("Logging in with the newly registered user", async () => {
    await request(app).post("/auth/login").send(requestBody).expect(200);
  });

  afterAll(async () => {
    await teardownDatabaseValues();
  });
});
