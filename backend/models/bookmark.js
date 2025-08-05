const db = require("./db.js");
const userModel = require("./user.js");
const tableName = "bookmark";

class Bookmark {
  constructor(
    id,
    hotel_id,
    hotel_name,
    hotel_address,
    image_url,
    hotel_ratings,
    userID
  ) {
    this.id = id;
    this.hotel_id = hotel_id;
    this.hotel_name = hotel_name;
    this.hotel_address = hotel_address;
    this.image_url = image_url;
    this.hotel_ratings = hotel_ratings;
    this.userID = userID;
  }
}
//the reason why i put varchar for hotel_ratings is that the api returns ratings as string eg. "NaN", "2"
async function sync() {
  try {
    db.pool.query(`
        CREATE TABLE IF NOT EXISTS ${tableName} (
            id INTEGER,
            hotel_id VARCHAR(255),
            hotel_name VARCHAR(255),
            hotel_address VARCHAR(255),
            image_url VARCHAR(255),
            hotel_ratings VARCHAR(255),
            userID INTEGER,
            PRIMARY KEY (id, hotel_id),
            FOREIGN KEY (userID) REFERENCES user (id)
        )
        `);
  } catch (error) {
    console.error("database connection failed. " + error);
    throw error;
  }
}

async function findbyHotelId(hotel_id) {
  try {
    const [rows, fieldDefs] = await db.pool.query(
      `SELECT ${tableName}.id,
      ${tableName}.hotel_id,
      ${tableName}.hotel_name,
      ${tableName}.hotel_address,
      ${tableName}.image_url,
      ${tableName}.hotel_ratings 
      FROM ${tableName}
      WHERE ${tableName}.hotel_id =?`,
      [hotel_id]
    );
    let list = [];
    for (let row of rows) {
      let bookmarkHotel = new Bookmark(row.id, row.hotel_id);
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
    const exists = await findbyHotelId(bookmark.hotel_id);
    //check if length of exists array is 0,hotel not bookmarked
    if (exists.length == 0) {
      const [rows, fieldDefs] = await db.pool.query(
        `INSERT INTO ${tableName}(id,hotel_id,hotel_name,hotel_address,image_url,hotel_ratings,userID) VALUES(?,?,?,?,?,?,?)`,

        [
          bookmark.id,
          bookmark.hotel_id,
          bookmark.hotel_name,
          bookmark.hotel_address,
          bookmark.image_url,
          bookmark.hotel_ratings,
          bookmark.userID,
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
    let userID = await userModel.findIDByEmail(email);
    const [rows, fieldDefs] = await db.pool.query(`
      SELECT * FROM ${tableName} WHERE ${tableName}.userID = ${userID}
      `);
    let bookmarks = [];
    for (let row of rows) {
      singleBookmarkDetails = new Bookmark(
        row.id,
        row.hotel_id,
        row.hotel_name,
        row.hotel_address,
        row.image_url,
        row.hotel_ratings,
        row.userID
      );
      bookmarks.push(singleBookmarkDetails);
    }
    return bookmarks;
  } catch (error) {
    console.error("Database connection failed" + error);
    return -1;
  }
}

async function removeHotelBookmark(hotelId) {
  if ((await findbyHotelId(hotelId)).length === 0) {
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
  findbyHotelId,
  getAllBookmarksPerUser,
  removeHotelBookmark,
};
