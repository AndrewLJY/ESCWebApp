const request = require("supertest");
const express = require("express");
const bookmarkModel = require("../../models/bookmark");
const userRouter = require("../../routes/user");

const fc = require("fast-check");

// user.test.js
jest.mock("../../auth_middleware/auth_middleware.js", () => {
  return jest.fn((req, res, next) => {
    req.userId = "test-user";
    next();
  });
});

const app = express();
app.use(express.json());
app.use("/", userRouter);

describe("Bookmark endpoints", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("(BLACK BOX UNIT) Testing POST /bookmarks/", () => {
    test("should add a bookmark and return 200", async () => {
      jest.spyOn(bookmarkModel, "insertOne").mockResolvedValue(1);
      const res = await request(app)
        .post("/bookmarks/")
        .set("Authorization", "Bearer fake-token")
        .send({
          // Add this linesend({
          hotel_id: "DIH7",
          hotel_name: "Hotel",
          hotel_address: "Addr",
          image_url: "http://abc.jpg",
          hotel_ratings: "5",
          user_email: "test@email.com",
          search_string: "search",
          destination_id: "dest",
        });
      expect(res.status).toBe(200);
    });

    test("should return 200 if already bookmarked, and send a message showing that hotel has already been bookmarked", async () => {
      jest.spyOn(bookmarkModel, "insertOne").mockResolvedValue(-1);
      const res = await request(app)
        .post("/bookmarks/")
        .set("Authorization", "Bearer fake-token")
        .send({
          hotel_id: "DIH7",
          hotel_name: "Hotel",
          hotel_address: "Addr",
          image_url: "http://abc.jpg",
          hotel_ratings: "5",
          user_email: "test@email.com",
          search_string: "search",
          destination_id: "dest",
        });
      expect(res.status).toBe(200);
    });

    test("should return 400 for invalid hotel_id type", async () => {
      const res = await request(app)
        .post("/bookmarks/")
        .set("Authorization", "Bearer fake-token")
        .send({
          hotel_id: "12345",
          hotel_name: "Hotel",
          hotel_address: "Addr",
          image_url: "http://abc.jpg",
          hotel_ratings: "5",
          user_email: "test@email.com",
          search_string: "search",
          destination_id: "dest",
        });
      expect(res.status).toBe(400);
    });
  });

  describe("(BLACK BOX UNIT) Testing GET /allBookmarks/:user_email", () => {
    test("should return bookmarks for a valid user", async () => {
      const bookmarks = [{ hotel_id: "1", hotel_name: "Hotel" }];
      jest
        .spyOn(bookmarkModel, "getAllBookmarksPerUser")
        .mockResolvedValue(bookmarks);
      const res = await request(app)
        .get("/allBookmarks/test@email.com")
        .set("Authorization", "Bearer fake-token");
      expect(res.status).toBe(200);
      expect(res.body).toEqual(bookmarks);
    });

    test("should return 400 for invalid email", async () => {
      const res = await request(app)
        .get("/allBookmarks/invalid-email")
        .set("Authorization", "Bearer fake-token");
      expect(res.status).toBe(400);
    });
  });

  describe("(BLACK BOX UNIT) Testing POST /deleteBookmark", () => {
    test("should delete a bookmark and return 200", async () => {
      jest.spyOn(bookmarkModel, "removeHotelBookmark").mockResolvedValue(1);
      const res = await request(app)
        .post("/deleteBookmark")
        .set("Authorization", "Bearer fake-token")
        .send({ hotel_id: "1", user_email: "test@email.com" });
      expect(res.status).toBe(200);
    });

    test("should return 400 if hotel not found", async () => {
      jest.spyOn(bookmarkModel, "removeHotelBookmark").mockResolvedValue(-1);
      const res = await request(app)
        .post("/deleteBookmark")
        .set("Authorization", "Bearer fake-token")
        .send({ hotel_id: "1", user_email: "test@email.com" });
      expect(res.status).toBe(400);
    });

    test("should return 400 for invalid email", async () => {
      const res = await request(app)
        .post("/deleteBookmark")
        .set("Authorization", "Bearer fake-token")
        .send({ hotel_id: "1", user_email: "invalid-email" });
      expect(res.status).toBe(400);
    });
  });
});

describe("(WHITE BOX UNIT) Testing the conditionals of our input parameter handling through fuzzing", () => {
  numRuns = 20;
  test("Testing /auth/bookmarks endpoint, with invalid parameters.", async () => {
    const urlSafeChars =
      "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_=/\\{}][><.,?`|_.~";

    const urlSafeString = fc
      .array(fc.constantFrom(...urlSafeChars), { minLength: 1, maxLength: 20 })
      .map((arr) => arr.join(""));

    await fc.assert(
      fc.asyncProperty(urlSafeString, async (data) => {
        requestBody = {
          hotel_id: data,
          hotel_name: "Grand Hyatt",
          hotel_address: "One Shit Place",
          image_url: data,
          hotel_ratings: data,
          user_email: data,
          search_string: data,
          destination_id: data,
        };

        const response = await request(app)
          .post(`/bookmarks/`)
          .send(requestBody);
        expect(response.status).toBeGreaterThanOrEqual(200);
        expect(response.status).toBeLessThanOrEqual(400);
      }),
      { numRuns: numRuns, verbose: true }
    );
  }, 120000);
});
