const db = require("./db.js");
const tableName = "booking";

class Booking {
  constructor(id, hotel_id) {
    this.id = id;
    this.hotel_id = hotel_id;
  }
}
//DATETIME FORMAT IS YYYY-MM-DD
async function sync() {
  try {
    db.pool.query(`
        CREATE TABLE IF NOT EXISTS ${tableName} (
            id INTEGER,
            hotel_id VARCHAR(255),
            destination_id VARCHAR(255),
            user_id INTEGER,
            booking_date DATETIME,
            PRIMARY KEY (id, hotel_id),
            FOREIGN KEY (user_id) REFERENCES user (id)
        )
        `);
  } catch (error) {
    console.error("database connection failed. " + error);
    throw error;
  }
}

module.exports = { Booking, sync };
