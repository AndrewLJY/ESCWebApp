const express = require("express");
const bookingModel = require("../models/booking");
var router = express.Router();
const bookingSchema = require("../validation/bookingSchema");

router.post("/",async function(req,res,next){
    //retrieve infos from booking
    const id = req.body.id;
    const hotel_id = req.body.hotel_id;
    const destination_id = req.body.destination_id;
    const no_of_nights = req.body.no_of_nights;
    const start_date = req.body.start_date;
    const end_date = req.body.end_date;
    const guest_count = req.body.guest_count;
    const message_to_hotel = req.body.message_to_hotel;
    const room_type = req.body.room_type;
    const total_price = req.body.total_price;
    const user_id = req.body.user_id;
    const full_name = req.body.full_name;
    const payment_id = req.body.payment_id;
    //body paramters validation
    const {error,value} = bookingSchema.validate(req.body);
    if (error){
        return res.status(400).send(`Invalid booking data: ${error}`);
    }
    
    const booking = new bookingModel.Booking(
        id,
        hotel_id,
        destination_id,
        no_of_nights,
        start_date,
        end_date,
        guest_count,
        message_to_hotel,
        room_type,
        total_price,
        user_id,
        full_name,
        payment_id
    );

    try{
    //try to insert into booking table
        result = await bookingModel.insertOne(booking);
        if (result == 1){
            return res.send("Successfully booked");
        }else if (result == -1 ){
            return res.send("Already booked");
        }
    } catch(error){
        console.error("database error " + error);
        return res.status(400).send("Database error");
    }

})

module.exports = router;