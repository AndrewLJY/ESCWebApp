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
      room_type: "Deluxe King",
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
      room_type: "Standard",
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
      room_type: "Standard",
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
      room_type: "Standard",
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
      room_type: "Standard",
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
