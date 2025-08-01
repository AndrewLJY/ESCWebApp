const db = require("./db.js");
const tableName = "bookmark";

class Booking {
  constructor(id, hotel_id) {
    this.id = id;
    this.hotel_id = hotel_id;
  }
}
async function sync() {
  try {
    db.pool.query(`
        CREATE TABLE IF NOT EXISTS ${tableName} (
            id INTEGER,
            hotel_id VARCHAR(255),
            hotel_name VARCHAR(255),
            Image_url VARCHAR(255),
            rating INTEGER(255),
            address VARCHAR(255),
            PRIMARY KEY (id, hotel_id),
            FOREIGN KEY (id) REFERENCES user (id)
        )
        `);
  } catch (error) {
    console.error("database connection failed. " + error);
    throw error;
  }
}

module.exports = { Booking, sync };
