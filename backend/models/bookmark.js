const db = require("./db.js");
var tableName;

if (process.env.NODE_ENV !== "test") {
  tableName = "bookmark";
} else {
  tableName = "bookmark_test_table";
}

class Bookmark {
  constructor(
    hotel_id,
    hotel_name,
    hotel_address,
    image_url,
    hotel_ratings,
    user_email,
    destination_id,
    search_string
  ) {
    this.hotel_id = hotel_id;
    this.hotel_name = hotel_name;
    this.hotel_address = hotel_address;
    this.image_url = image_url;
    this.hotel_ratings = hotel_ratings;
    this.user_email = user_email;
    this.destination_id = destination_id;
    this.search_string = search_string;
  }
}
//the reason why i put varchar for hotel_ratings is that the api returns ratings as string eg. "NaN", "2"
async function sync() {
  try {
    db.pool.query(`
        CREATE TABLE IF NOT EXISTS ${tableName} (
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
  } catch (error) {
    console.error("database connection failed. " + error);
    throw error;
  }
}

async function findbyHotelUserId(hotel_id, user_email) {
  try {
    const [rows, fieldDefs] = await db.pool.query(
      `
      SELECT
      ${tableName}.hotel_id,
      ${tableName}.hotel_name,
      ${tableName}.hotel_address,
      ${tableName}.image_url,
      ${tableName}.hotel_ratings,
      ${tableName}.user_email,
      ${tableName}.destination_id,
      ${tableName}.search_string
      FROM ${tableName}
      WHERE ${tableName}.hotel_id = ? AND ${tableName}.user_email = ?`,
      [hotel_id, user_email]
    );
    let list = [];
    for (let row of rows) {
      let bookmarkHotel = new Bookmark(
        row.hotel_id,
        row.hotel_name,
        row.hotel_address,
        row.image_url,
        row.hotel_ratings,
        row.user_email,
        row.destination_id,
        row.search_string
      );
      list.push(bookmarkHotel);
    }
    return list;
  } catch (error) {
    console.log("database connection failed." + error);
    throw error;
  }
}
async function insertOne(bookmark) {
  try {
    //check if the hotel is already bookmarked(already inside table)
    const exists = await findbyHotelUserId(
      bookmark.hotel_id,
      bookmark.user_email
    );
    //check if length of exists array is 0,hotel not bookmarked
    if (exists.length == 0) {
      await db.pool.query(
        `INSERT INTO ${tableName}(hotel_id,hotel_name,hotel_address,image_url,hotel_ratings,user_email, destination_id, search_string) VALUES(?,?,?,?,?,?,?,?)`,
        [
          bookmark.hotel_id,
          bookmark.hotel_name,
          bookmark.hotel_address,
          bookmark.image_url,
          bookmark.hotel_ratings,
          bookmark.user_email,
          bookmark.destination_id,
          bookmark.search_string,
        ]
      );
      return 1;
    } else {
      console.log("hotel is already bookmarked");
      return -1;
    }
    //to prevent foreign key constraint error, need to create a user with that specific id in the User table,before referencing userID in Bookmark table
  } catch (error) {
    console.error("database connection failed " + error);
    throw error;
  }
}

async function getAllBookmarksPerUser(email) {
  try {
    const [rows, fieldDefs] = await db.pool.query(
      `
      SELECT * FROM ${tableName} WHERE ${tableName}.user_email = ?
      `,
      [email]
    );
    let bookmarks = [];
    for (let row of rows) {
      singleBookmarkDetails = new Bookmark(
        row.hotel_id,
        row.hotel_name,
        row.hotel_address,
        row.image_url,
        row.hotel_ratings,
        row.user_email,
        row.destination_id,
        row.search_string
      );
      bookmarks.push(singleBookmarkDetails);
    }
    return bookmarks;
  } catch (error) {
    console.error("Database connection failed" + error);
    return -1;
  }
}

async function removeHotelBookmark(hotelId, email) {
  if ((await findbyHotelUserId(hotelId, email)).length === 0) {
    console.error("hotel does not exist in database.");
    return -1;
  }
  try {
    await db.pool.query(`
      DELETE FROM ${tableName} WHERE ${tableName}.hotel_id = ${hotelId}
      `);
    return 0;
  } catch (error) {
    console.error("Database connection failed" + error);
    return -1;
  }
}

module.exports = {
  Bookmark,
  sync,
  insertOne,
  findbyHotelUserId,
  getAllBookmarksPerUser,
  removeHotelBookmark,
};
