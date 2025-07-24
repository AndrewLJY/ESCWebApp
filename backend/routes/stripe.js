const express = require('express');

var router = express.Router();

const YOUR_DOMAIN = 'http://localhost:5173';
// const stripe = require('stripe')('INSERT SK HERE');
const stripe = require('stripe')(`${process.env.VITE_STRIPE_SK}`);

router.post('/create-checkout-session', async (req, res) => {
  const roomName = req.body.roomName;
  const roomPrice = req.body.roomPrice;
  const session = await stripe.checkout.sessions.create({
    ui_mode: 'embedded',
    line_items: [
      {
        price_data: {
          currency: 'sgd',
          product_data: {
            name: roomName,
          },
          unit_amount: roomPrice,
        },
        quantity: 1,
      },
    ],
    mode: 'payment',
    return_url: `${YOUR_DOMAIN}/return?session_id={CHECKOUT_SESSION_ID}`,
  });

  res.send({clientSecret: session.client_secret});
});

router.get('/session-status', async (req, res) => {
  const session = await stripe.checkout.sessions.retrieve(req.query.session_id);

  res.send({
    status: session.status,
    customer_email: session.customer_details.email
  });
});

module.exports = router;