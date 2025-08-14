const express = require("express");

var router = express.Router();

const YOUR_DOMAIN = "http://localhost:5173";
const stripe = require("stripe")(`${process.env.VITE_STRIPE_SK}`);

router.post("/create-checkout-session", async (req, res) => {
  try {
    const roomName = req.body.roomName;
    const roomPrice = Math.round(req.body.roomPrice * 100);
    const roomImages = req.body.roomImages;
    const bookingDetails = req.body.bookingDetails;

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
  } catch (error) {
    console.error("Error creating checkout session:", error);
    res.status(400).send({ error: "Failed to create checkout session" });
  }
});

router.get("/session-status", async (req, res) => {
  try {
    if (!req.query.session_id) {
      return res.status(400).send({ error: "Session ID is required" });
    }

    const session = await stripe.checkout.sessions.retrieve(
      req.query.session_id
    );

    var metadata = session.metadata;
    metadata.specialReq = session.custom_fields[0].text.value;
    metadata.totalPrice = session.amount_total / 100;
    metadata.id = session.id;
    metadata.paymentId = session.payment_intent;
    

    res.send({
      status: session.status,
      customer_details: session.customer_details,
      metadata: session.metadata,
    });
  } catch (error) {
    console.error("Error retrieving session:", error);
    res.status(400).send({ error: "Failed to retrieve session status" });
  }
});

module.exports = router;
