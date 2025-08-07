const request = require("supertest");
const express = require("express");
const bookmarkModel = require("../../models/bookmark");
const userRouter = require("../../routes/user");

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

  describe("POST /bookmarks/", () => {
    it("should add a bookmark and return 200", async () => {
      jest.spyOn(bookmarkModel, "insertOne").mockResolvedValue(1);
      const res = await request(app)
        .post("/bookmarks/")
        .set("Authorization", "Bearer fake-token")
        .send({
          // Add this linesend({
          hotel_id: "1",
          hotel_name: "Hotel",
          hotel_address: "Addr",
          image_url: "img",
          hotel_ratings: "5",
          user_email: "test@email.com",
          search_string: "search",
          destination_id: "dest",
        });
      expect(res.status).toBe(200);
      expect(res.text).toBe("Successfully bookmarked");
    });

    it("should return 401 if already bookmarked", async () => {
      jest.spyOn(bookmarkModel, "insertOne").mockResolvedValue(-1);
      const res = await request(app)
        .post("/bookmarks/")
        .set("Authorization", "Bearer fake-token")
        .send({
          hotel_id: "1",
          hotel_name: "Hotel",
          hotel_address: "Addr",
          image_url: "img",
          hotel_ratings: "5",
          user_email: "test@email.com",
          search_string: "search",
          destination_id: "dest",
        });
      expect(res.status).toBe(401);
      expect(res.text).toBe("Already bookmarked");
    });

    it("should return 400 for invalid hotel_id type", async () => {
      const res = await request(app)
        .post("/bookmarks/")
        .set("Authorization", "Bearer fake-token")
        .send({
          hotel_id: 123,
          hotel_name: "Hotel",
          hotel_address: "Addr",
          image_url: "img",
          hotel_ratings: "5",
          user_email: "test@email.com",
          search_string: "search",
          destination_id: "dest",
        });
      expect(res.status).toBe(400);
      expect(res.text).toBe("Invalid hotel id input");
    });
  });

  describe("GET /allBookmarks/:user_email", () => {
    it("should return bookmarks for a valid user", async () => {
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

    it("should return 400 for invalid email", async () => {
      const res = await request(app)
        .get("/allBookmarks/invalid-email")
        .set("Authorization", "Bearer fake-token");
      expect(res.status).toBe(400);
      expect(res.text).toBe("Invalid email format.");
    });
  });

  describe("POST /deleteBookmark", () => {
    it("should delete a bookmark and return 200", async () => {
      jest.spyOn(bookmarkModel, "removeHotelBookmark").mockResolvedValue(1);
      const res = await request(app)
        .post("/deleteBookmark")
        .set("Authorization", "Bearer fake-token")
        .send({ hotel_id: "1", user_email: "test@email.com" });
      expect(res.status).toBe(200);
      expect(res.text).toBe("Deleted");
    });

    it("should return 400 if hotel not found", async () => {
      jest.spyOn(bookmarkModel, "removeHotelBookmark").mockResolvedValue(-1);
      const res = await request(app)
        .post("/deleteBookmark")
        .set("Authorization", "Bearer fake-token")
        .send({ hotel_id: "1", user_email: "test@email.com" });
      expect(res.status).toBe(400);
      expect(res.text).toBe("Error, hotel does not exist in database");
    });

    it("should return 400 for invalid email", async () => {
      const res = await request(app)
        .post("/deleteBookmark")
        .set("Authorization", "Bearer fake-token")
        .send({ hotel_id: "1", user_email: "invalid-email" });
      expect(res.status).toBe(400);
      expect(res.text).toBe("Invalid email format.");
    });
  });
});
