const db = require("./db.js");
const tableName = "booking";

class Booking {
  constructor(id, hotel_id, destination_id, no_of_nights, start_date, end_date, guest_count, message_to_hotel, room_type, total_price, user_id, full_name, payment_id) {
    this.id = id;
    this.hotel_id = hotel_id;
    this.destination_id = destination_id;
    this.no_of_nights = no_of_nights;
    this.start_date = start_date;
    this.end_date = end_date;
    this.guest_count = guest_count;
    this.message_to_hotel = message_to_hotel;
    this.room_type = room_type; 
    this.total_price = total_price;
    this.user_id = user_id;
    this.full_name = full_name;
    this.payment_id = payment_id;
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
            no_of_nights INTEGER,
            start_date DATE,
            end_date DATE,
            guest_count INTEGER,
            message_to_hotel TEXT,
            room_type VARCHAR(255),
            total_price INTEGER,
            user_id INTEGER,
            full_name VARCHAR(255),
            payment_id VARCHAR(255),
            PRIMARY KEY (id, hotel_id),
            FOREIGN KEY (user_id) REFERENCES user (id)
        )
        `);
  } catch (error) {
    console.error("database connection failed. " + error);
    throw error;
  }
}
async function findbyBookingId(booking_id){
  try{
    const [rows,fieldDefs] = await db.pool.query(`
      SELECT 
      ${tableName}.id,
      ${tableName}.hotel_id,
      ${tableName}.destination_id,
      ${tableName}.no_of_nights,
      ${tableName}.start_date,
      ${tableName}.end_date,
      ${tableName}.guest_count,
      ${tableName}.message_to_hotel,
      ${tableName}.room_type,
      ${tableName}.total_price,
      ${tableName}.user_id,
      ${tableName}.full_name,
      ${tableName}.payment_id
      FROM ${tableName}
      WHERE ${tableName}.id =?`);
let list = [];
for (let row of rows){
  let bookingHotel = new Booking(row.id,row.hotel_id);
  list.push(bookingHotel);
}
  }catch (error){
    console.log("database connection failed." + error);
    throw error;
  }
}
module.exports = { Booking, sync };
