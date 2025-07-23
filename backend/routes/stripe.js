const express = require('express');

var router = express.Router();

const YOUR_DOMAIN = 'http://localhost:5173';
const stripe = require('stripe')('sk_test_51Ro2oWGfz5d03nx5HgBGjVH2qHEfvZFRjiHFNvI2gjDHVpj7g5sM8SEYMh93dXVUtSZEtT4nfogQ2hNngyaoctdm00r1VPtAss');

router.post('/create-checkout-session', async (req, res) => {
  const session = await stripe.checkout.sessions.create({
    ui_mode: 'embedded',
    line_items: [
      {
        price_data: {
          currency: 'usd',
          product_data: {
            name: 'T-shirt',
          },
          unit_amount: 2000,
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