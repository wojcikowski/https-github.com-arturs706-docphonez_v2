const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
require('dotenv').config();
const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');


router.post('/create-payment-intent',bodyParser.json(), async (req, res) => {
  const { amount, email, fullname, phone, addtometadata, usid} = req.body;
  const roundedAmount = Math.round(amount * 100);

  const customercreated = await stripe.customers.create({
    email: email,
    name: fullname,
    phone: phone,
    address: {
      line1: '123 Test Street',
      city: 'London',
      country: 'GB',
      postal_code: 'E1 4AA',
    },
  });

  // const cartString = JSON.stringify(cart);

  const paymentIntent = await stripe.paymentIntents.create({
    amount: roundedAmount,
    currency: 'GBP',
    automatic_payment_methods: {
      enabled: true,
    },
    metadata: {fullname: fullname, customeremail: email , orderdet: addtometadata, userid: usid},
    customer: customercreated.id,
    // metadata: {userid: userid, productid: productid, productqty: productqty},
  });
  res.send({
    clientSecret: paymentIntent.client_secret,
  });
});


router.get('/test', (req, res) => {
  res.json({message: 'test'});
});



module.exports = router;

