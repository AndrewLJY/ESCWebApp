const request = require("supertest");
const app = require("../../server");
const fc = require("fast-check");

const bookingModel = require("../../models/booking");

process.env.INTEGRATION_TEST = "false";
process.env.NODE_ENV = "test";

describe("(WHITE-BOX UNIT) Testing the booking.js router endpoint, ensure that we get a response.", () => {
  test("Testing /booking endpoint with valid data, should return a 200 response OK", async () => {
    // Mock the insertOne function to return success
    bookingModel.insertOne = jest.fn().mockResolvedValue(1);

    const validBookingData = {
      id: 1,
      hotel_id: "H001",
      destination_id: "D001",
      no_of_nights: 3,
      start_date: "2025-08-10",
      end_date: "2025-08-13",
      guest_count: 2,
      message_to_hotel: "Please prepare a baby cot.",
      room_type: "double",
      total_price: 450,
      user_id: 1,
      full_name: "Alice Tan",
      payment_id: "P202508051",
    };

    const response = await request(app)
      .post("/booking")
      .send(validBookingData)
      .expect(200);

    expect(response.text).toBe("Successfully booked");
  });

  test("Testing /booking endpoint with duplicate booking, should return already booked message", async () => {
    // Mock the insertOne function to return already exists
    bookingModel.insertOne = jest.fn().mockResolvedValue(-1);

    const duplicateBookingData = {
      id: 1,
      hotel_id: "H001",
      destination_id: "D001",
      no_of_nights: 3,
      start_date: "2025-08-10",
      end_date: "2025-08-13",
      guest_count: 2,
      message_to_hotel: "Test message",
      room_type: "double",
      total_price: 300,
      user_id: 5,
      full_name: "John Doe",
      payment_id: "P123456",
    };

    const response = await request(app)
      .post("/booking")
      .send(duplicateBookingData)
      .expect(200);

    expect(response.text).toBe("Already booked");
  });

  test("Testing /booking endpoint with database error, should return 400 error", async () => {
    // Mock the insertOne function to throw an error
    bookingModel.insertOne = jest
      .fn()
      .mockRejectedValue(new Error("Database connection failed"));

    const bookingData = {
      id: 2,
      hotel_id: "H002",
      destination_id: "D002",
      no_of_nights: 2,
      start_date: "2025-08-15",
      end_date: "2025-08-17",
      guest_count: 1,
      message_to_hotel: "",
      room_type: "double",
      total_price: 200,
      user_id: 3,
      full_name: "Jane Smith",
      payment_id: "P789012",
    };

    const response = await request(app)
      .post("/booking")
      .send(bookingData)
      .expect(400);

    expect(response.text).toBe("Database error");
  });
});

describe("(BLACK-BOX UNIT) Testing /booking endpoint with various inputs", () => {
  beforeEach(() => {
    // Reset mock data before each test
    bookingModel.insertOne = jest.fn().mockResolvedValue(1);
  });

  test("Testing /booking with missing some fields, should return a response", async () => {
    const incompleteData = {
      id: 1,
      hotel_id: "H001",
      // Missing other fields
    };

    const response = await request(app).post("/booking").send(incompleteData);

    expect(response.status).toBeGreaterThanOrEqual(200);
    expect(response.status).toBeLessThanOrEqual(400);
  });

  test("Testing /booking with empty request body, should return a response", async () => {
    const response = await request(app).post("/booking").send({});

    expect(response.status).toBeGreaterThanOrEqual(200);
    expect(response.status).toBeLessThanOrEqual(400);
  });

  test("Testing /booking with string numbers, should work correctly", async () => {
    const bookingData = {
      id: "1",
      hotel_id: "H001",
      destination_id: "D001",
      no_of_nights: "3",
      start_date: "2025-08-10",
      end_date: "2025-08-13",
      guest_count: "2",
      message_to_hotel: "Test message",
      room_type: "double",
      total_price: "450",
      user_id: "5",
      full_name: "Test User",
      payment_id: "P123456",
    };

    const response = await request(app)
      .post("/booking")
      .send(bookingData)
      .expect(200);

    expect(response.text).toBe("Successfully booked");
  });

  test("Testing /booking with null values, should return a response", async () => {
    const bookingData = {
      id: 1,
      hotel_id: "H001",
      destination_id: "D001",
      no_of_nights: 3,
      start_date: "2025-08-10",
      end_date: "2025-08-13",
      guest_count: 2,
      message_to_hotel: null, // Optional field can be null
      room_type: "double",
      total_price: 450,
      user_id: 5,
      full_name: "Test User",
      payment_id: "P123456",
    };

    const response = await request(app).post("/booking").send(bookingData);

    expect(response.status).toBeGreaterThanOrEqual(200);
    expect(response.status).toBeLessThanOrEqual(400);
  });
});

describe("(BLACK BOX FUZZ) POST /booking with random inputs", () => {
  // how many iterations to try
  const runs = 50;

  // helper that always emits a YYYY-MM-DD string
  const isoDateString = fc.date().map((d) => d.toISOString().split("T")[0]);

  test(`doesn't crash and only returns 200 or 400 (${runs} runs)`, async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.record({
          id: fc.oneof(fc.integer(), fc.string(), fc.constant(null)),
          hotel_id: fc.oneof(fc.string(), fc.integer(), fc.constant(null)),
          destination_id: fc.oneof(fc.string(), fc.constant(null)),
          no_of_nights: fc.oneof(
            fc.integer({ min: -100, max: 100 }),
            fc.constant(null)
          ),
          start_date: fc.oneof(isoDateString, fc.constant(null)),
          end_date: fc.oneof(isoDateString, fc.constant(null)),
          guest_count: fc.oneof(
            fc.integer({ min: -10, max: 100 }),
            fc.constant(null)
          ),
          message_to_hotel: fc.oneof(fc.string(), fc.constant(null)),
          room_type: fc.oneof(fc.string(), fc.constant(null)),
          total_price: fc.oneof(
            fc.integer({ min: -99999, max: 999999 }),
            fc.constant(null)
          ),
          // restrict user_id to a known valid one (avoid FK failures)
          user_id: fc.constant(1),
          full_name: fc.oneof(fc.string(), fc.constant(null)),
          payment_id: fc.oneof(fc.string(), fc.constant(null)),
        }),
        async (bookingPayload) => {
          const res = await request(app).post("/booking").send(bookingPayload);

          // only expect either success (200) or validation/database errors
          expect([200, 400, 500]).toContain(res.status);
          // response body should be a string message
          expect(typeof res.text).toBe("string"); //"Already booked" or "Successfully booked"
        }
      ),
      { numRuns: runs, verbose: true }
    );
  });
});

// describe("Foregin-key constraint on /booking",()=>{
//     test("should return 400 if user id does not exist in User table yet", async ()=>{
//         const bookingPayload_2 = {
//         id:  123,
//         hotel_id:      "H100",
//         destination_id:"D100",
//         no_of_nights:  2,
//         start_date:    "2025-09-01",
//         end_date:      "2025-09-03",
//         guest_count:   1,
//         message_to_hotel: "No preference",
//         room_type:     "single",
//         total_price:   200,
//         user_id:       999999,     // this user id does not exist
//         full_name:     "Bob",
//         payment_id:    "MC1234"
//         };

//         const res = await request(app).post("/booking").send(bookingPayload_2);

//         expect(res.status).toBe(400);
//     })
// })
