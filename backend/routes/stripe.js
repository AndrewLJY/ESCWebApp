const express = require("express");

var router = express.Router();

const YOUR_DOMAIN = "http://localhost:5173";
const stripe = require("stripe")(`${process.env.VITE_STRIPE_SK}`);

router.post("/create-checkout-session", async (req, res) => {
  const roomName = req.body.roomName;
  const roomPrice = Math.round(req.body.roomPrice * 100);
  const roomImages = req.body.roomImages;
  const bookingDetails = req.body.bookingDetails;
  console.log(bookingDetails);

  const session = await stripe.checkout.sessions.create({
    ui_mode: "embedded",
    billing_address_collection: "required",
    phone_number_collection: {
      enabled: true,
    },
    line_items: [
      {
        price_data: {
          currency: "sgd",
          product_data: {
            name: roomName,
            images: roomImages,
          },
          unit_amount: roomPrice,
        },
        quantity: 1,
      },
    ],
    custom_fields: [
      {
        key: "specialRequests",
        label: {
          type: "custom",
          custom: "Special Requests to the Hotel",
        },
        type: "text",
        optional: true,
      },
    ],
    mode: "payment",
    metadata: bookingDetails,
    return_url: `${YOUR_DOMAIN}/return?session_id={CHECKOUT_SESSION_ID}`,
  });

  res.send({ clientSecret: session.client_secret });
});

router.get("/session-status", async (req, res) => {
  const session = await stripe.checkout.sessions.retrieve(req.query.session_id);

  console.log(session);

  res.send({
    status: session.status,
    customer_email: session.customer_details.email,
  });
});

module.exports = router;
