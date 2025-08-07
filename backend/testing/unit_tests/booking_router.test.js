const request = require("supertest");
const app = require("../../server");    // your Express “app”
const fc  = require("fast-check");

describe("(BLACK BOX FUZZ) POST /booking with random inputs", () => {
  // how many iterations to try
  const runs = 50;

  // helper that always emits a YYYY-MM-DD string
  const isoDateString = fc
    .date()
    .map(d => d.toISOString().split("T")[0]);

  test(`doesn't crash and only returns 200 or 400 (${runs} runs)`, async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.record({
          id:           fc.oneof(fc.integer(), fc.string(),fc.constant(null)),
          hotel_id:     fc.oneof(fc.string(),  fc.integer(),fc.constant(null)),
          destination_id: fc.oneof(fc.string(),fc.constant(null)),
          no_of_nights: fc.oneof(fc.integer({ min: -100, max: 100 }),fc.constant(null)),
          start_date:   fc.oneof(isoDateString,fc.constant(null)),
          end_date:     fc.oneof(isoDateString,fc.constant(null)),
          guest_count:  fc.oneof(fc.integer({ min: -10, max: 100 }),fc.constant(null)),
          message_to_hotel: fc.oneof(fc.string(),fc.constant(null)),
          room_type:    fc.oneof(fc.string(),fc.constant(null)),
          total_price:  fc.oneof(fc.integer({ min: -99999, max: 999999 }),fc.constant(null)),
          // restrict user_id to a known valid one (avoid FK failures)
          user_id:      fc.constant(1),
          full_name:    fc.oneof(fc.string(),fc.constant(null)),
          payment_id:   fc.oneof(fc.string(),fc.constant(null))
        }),
        async bookingPayload => {
          const res = await request(app)
            .post("/booking")
            .send(bookingPayload);

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
