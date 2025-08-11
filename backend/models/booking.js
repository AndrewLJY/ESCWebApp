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
    const [rows,fieldDefs] = await db.pool.query(
      `SELECT 
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
      WHERE ${tableName}.id =?`,
      [booking_id]
    );
let list = [];
for (let row of rows){
  let bookingHotel = new Booking(row.booking_id,row.hotel_id);
  list.push(bookingHotel);
  }
return list;
  }catch (error){
    console.log("database connection failed." + error);
    throw error;
  }
}
async function insertOne(booking){
  try {

    //check if the booking id is already in the booking table
    const exists = await findbyBookingId(booking.id);
    console.log("exists is ",exists);
    //check if length of exists array is 0, booking is not made 

    if (exists.length == 0 ){
      const [rows,fieldDefs] = await db.pool.query(
        `INSERT INTO ${tableName} (id, hotel_id, destination_id, no_of_nights, start_date, end_date, guest_count, message_to_hotel, room_type, total_price, user_id, full_name, payment_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
        booking.id, booking.hotel_id, booking.destination_id, booking.no_of_nights,
        booking.start_date, booking.end_date, booking.guest_count, booking.message_to_hotel,
        booking.room_type, booking.total_price, booking.user_id, booking.full_name, booking.payment_id
        ]
      );
      return 1;
    } else {
      console.log("booking is already made");
      return -1;
    }
  }catch (error){
    return("database connection failed " + error);
    
  }
}
module.exports = { Booking, sync,insertOne,findbyBookingId };
