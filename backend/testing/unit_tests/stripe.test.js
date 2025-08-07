const request = require("supertest");
const app = require("../../server");

// Mock Stripe module
jest.mock("stripe", () => {
  return jest.fn(() => ({
    checkout: {
      sessions: {
        create: jest.fn(),
        retrieve: jest.fn(),
      },
    },
  }));
});

describe("Stripe Payment Integration Tests", () => {
  let stripe;

  beforeEach(() => {
    // Get the mocked stripe instance
    stripe = require("stripe")();
    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  describe("POST /create-checkout-session", () => {
    test("should create a checkout session successfully", async () => {
      // Mock data that would be sent from the frontend
      const mockRequestBody = {
        roomName: "Deluxe Suite",
        roomPrice: 199.99,
        roomImages: ["https://example.com/room1.jpg"],
        bookingDetails: {
          checkIn: "2025-08-10",
          checkOut: "2025-08-15",
          guestCount: 2,
        },
      };
      const targetRequest = {
        ui_mode: "embedded",
        billing_address_collection: "required",
        phone_number_collection: {
          enabled: true,
        },
        line_items: [
          {
            price_data: {
              currency: "sgd",
              product_data: {
                name: "Deluxe Suite",
                images: ["https://example.com/room1.jpg"],
              },
              unit_amount: 199.99,
            },
            quantity: 1,
          },
        ],
        custom_fields: [
          {
            key: "specialRequests",
            label: {
              type: "custom",
              custom: "Special Requests to the Hotel",
            },
            type: "text",
            optional: true,
          },
        ],
        mode: "payment",
        metadata: {
          checkIn: "2025-08-10",
          checkOut: "2025-08-15",
          guestCount: 2,
        },
        return_url: `http://localhost:5173/return?session_id={CHECKOUT_SESSION_ID}`,
      };

      // Mock Stripe's response
      const mockSession = {
        client_secret: "mock_secret_123",
      };

      // Setup the mock implementation for this test
      stripe.checkout.sessions.create.mockResolvedValue(mockSession);

      // Make the request
      const response = await request(app)
        .post("/stripe/create-checkout-session")
        .send(mockRequestBody)
        .expect(200);

      // Verify the response
      expect(response.body).toHaveProperty("clientSecret", "mock_secret_123");

      // Verify Stripe was called with correct parameters
      expect(stripe.checkout.sessions.create).toHaveBeenCalledWith(
        expect.objectContaining({
          ui_mode: "embedded",
          billing_address_collection: "required",
          line_items: [
            {
              price_data: {
                currency: "sgd",
                product_data: {
                  name: mockRequestBody.roomName,
                  images: mockRequestBody.roomImages,
                },
                unit_amount: Math.round(mockRequestBody.roomPrice * 100),
              },
              quantity: 1,
            },
          ],
          mode: "payment",
          metadata: mockRequestBody.bookingDetails,
        })
      );
    });

    test("should handle Stripe errors gracefully", async () => {
      const mockRequestBody = {
        roomName: "Deluxe Suite",
        roomPrice: 199.99,
        roomImages: ["https://example.com/room1.jpg"],
        bookingDetails: {
          checkIn: "2025-08-10",
          checkOut: "2025-08-15",
          guestCount: 2,
        },
      };

      // Mock Stripe throwing an error
      stripe.checkout.sessions.create.mockRejectedValue(
        new Error("Stripe API Error")
      );

      // Make the request and expect an error response
      await request(app)
        .post("/stripe/create-checkout-session")
        .send(mockRequestBody)
        .expect(400);
    });
  });

  describe("GET /session-status", () => {
    test("should retrieve session status successfully", async () => {
      const mockSessionId = "cs_test_123";
      const mockSession = {
        status: "complete",
        customer_details: {
          email: "test@example.com",
        },
        metadata: {
          checkIn: "2025-08-10",
          checkOut: "2025-08-15",
          guestCount: "2",
        },
      };

      // Setup the mock implementation
      stripe.checkout.sessions.retrieve.mockResolvedValue(mockSession);

      // Make the request
      const response = await request(app)
        .get("/stripe/session-status")
        .query({ session_id: mockSessionId })
        .expect(200);

      // Verify the response
      expect(response.body).toEqual({
        status: mockSession.status,
        customer_email: mockSession.customer_details.email,
        metadata: mockSession.metadata,
      });

      // Verify Stripe was called with correct session ID
      expect(stripe.checkout.sessions.retrieve).toHaveBeenCalledWith(
        mockSessionId
      );
    });

    test("should handle missing session ID", async () => {
      await request(app).get("/stripe/session-status").expect(400); // You might need to add this error handling to your route
    });

    test("should handle Stripe retrieval errors", async () => {
      const mockSessionId = "cs_test_123";

      // Mock Stripe throwing an error
      stripe.checkout.sessions.retrieve.mockRejectedValue(
        new Error("Session not found")
      );

      await request(app)
        .get("/stripe/session-status")
        .query({ session_id: mockSessionId })
        .expect(400); // You might need to add this error handling to your route
    });
  });
});
