require('dotenv').config();
const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');
const Stripe = require('stripe');
const client = require('../db/conn');
const { session } = require('passport');

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2022-11-15',
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;



let data;
let eventType;

const orderConfirmationTemplate = (customer_name, total, items) => `
<html>
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <title>DoctorPhonez Order Confirmation</title>
    <link href="https://fonts.googleapis.com/css?family=Roboto:400,700&display=swap" rel="stylesheet">
  </head>
  <body style="background-color: #fff; font-family: 'Roboto', sans-serif; font-size: 16px; line-height: 1.4; color: #000235;">
    <div style="background-color: #000235; padding: 20px; color: #fff; text-align: center;">
      <h1 style="margin-top: 20px;">DoctorPhonez</h1>
    </div>
    <div style="padding: 20px;">
      <p>Dear ${customer_name},</p>
      <p>Thank you for your order! We are pleased to confirm that your order has been received and is being processed. Your order details are as follows:</p>
      <table style="border-collapse: collapse; width: 100%; margin-bottom: 20px;">
        <thead style="background-color: #000235; color: #fff;">
          <tr>
            <th style="padding: 10px; text-align: left;">Photo</th>
            <th style="padding: 10px; text-align: left;">Product</th>
            <th style="padding: 10px; text-align: left;">Quantity</th>
            <th style="padding: 10px; text-align: left;">Price</th>
          </tr>
        </thead>
        <tbody>
          ${items.map(item => `
            <tr style="border-bottom: 1px solid #ccc;">
              <td style="padding: 10px;"><img src="${item.image_url}" alt="${item.product_name}" style="max-width: 100px;"></td>
              <td style="padding: 10px;">${item.product_name}</td>
              <td style="padding: 10px;">${item.quantity}</td>
              <td style="padding: 10px;">£${item.price}</td>
            </tr>
          `).join('')}
          <tr>
            <td style="padding: 10px;"></td>
            <td style="padding: 10px;"></td>
            <td style="padding: 10px; text-align: right;"><strong>Total:</strong></td>
            <td style="padding: 10px;"><strong>£${total}</strong></td>
          </tr>
        </tbody>
      </table>
      <p>We will send you another email once your order has been shipped. If you have any questions or concerns, please don't hesitate to contact us at support@doctorphonez.co.uk.</p>
    </div>
    <div style="background-color: #000235; padding: 20px; color: #fff; text-align: center;">
      <p style="margin-top: 20px;">This email confirms that your order has been received and processed. Thank you for shopping at DoctorPhonez!</p>
    </div>
  </body>
</html>`




const establishConnection = async () => {
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
      user: process.env.SMTP_USERNAME,
      pass: process.env.SMTP_PASSWORD
    }
  });
  return transporter;
}

const sendEmail = async (customerEmail, customerName, total, items) => {
  try {
    const transporter = await establishConnection();
    const mailOptions = {
      from: process.env.SMTP_USERNAME,
      to: customerEmail,
      subject: "Order Confirmation",
      html: orderConfirmationTemplate(customerName, total, items)
    };
    await transporter.sendMail(mailOptions);
    console.log("Email sent successfully");
  } catch (error) {
    console.error("Error sending email:", error);
    throw new Error("Failed to send email");
  }
}
  

router.post('/send-email', async (req, res) => {
    try {
await sendEmail();
res.status(200).json({ message: 'Email sent successfully' });
} catch (error) {
console.error(error);
res.status(500).json({ error: 'Failed to send email' });
}
});

router.post("/webhooks", express.raw({ type: "application/json" }), async(request, response) => {
const sig = request.headers["stripe-signature"];
// stripe
let event;
try {
  event = stripe.webhooks.constructEvent(request.body, sig, webhookSecret);
} catch (err) {
  response.status(400).send(`Webhook Error: ${err.message}`);
  return;
}
// Handle the event
switch (event.type) {
  case "charge.succeeded":
  const session = event.data.object;
  console.log(session.payment_method_details);

  //check the data type of session.payment_intent
    const parseJSON = JSON.parse(session.metadata.orderdet)
    //create a new array to store the product names along with the quantities
    const products = [];
    //retrieve all product names from SQL database using the modelnr, and then add it to the parseJSON array
    for (let i = 0; i < parseJSON.length; i++) {
      const item = parseJSON[i];
      //retrieve the product name and price from the database
      const product = await client.query(`SELECT 
      products.prodname, 
      products.price, 
      productimages.imagetwo,
      productspecs.color,
      productspecs.memory
  FROM 
      products 
      INNER JOIN productimages ON products.modelnr = productimages.productmodel 
      INNER JOIN productspecs ON products.modelnr = productspecs.productmodel
  WHERE 
      products.modelnr = '${item.modelnr}'`);
      //add the product name, price and imagetwo to the products array along with the quantity
      products.push({
        image_url: product.rows[0].imagetwo,
        product_name: product.rows[0].prodname,
        quantity: item.quantity,
        price: product.rows[0].price,
        color: product.rows[0].color,
        memory: product.rows[0].memory
      });
    }
    
    
    //insert into the the userorders table the payment id, the user id and the total amount
    if (session.payment_method_details.type === "card" && session.payment_method_details.card.wallet === null){
    //convert session.payment_method_details.card.last4 to a string to be able to insert it into the database
    const last4 = session.payment_method_details.card.last4.toString();
    client.query(`insert into userorders VALUES ('${session.payment_intent}', '${session.metadata.customeremail}', '${session.amount/100}', '${session.receipt_url}', '${session.payment_method_details.card.brand}', '${last4}')`);
    } else if (session.payment_method_details.type === "card" && session.payment_method_details.card.wallet !== null) {
      const last4 = session.payment_method_details.card.last4.toString();
      client.query(`insert into userorders VALUES ('${session.payment_intent}', '${session.metadata.customeremail}', '${session.amount/100}', '${session.receipt_url}', '${session.payment_method_details.card.wallet.type}', '${last4}')`);
    }
    else if (session.payment_method_details.type === "klarna") {
      client.query(`insert into userorders VALUES ('${session.payment_intent}', '${session.metadata.customeremail}', '${session.amount/100}', '${session.receipt_url}', '${session.payment_method_details.type}', '${session.payment_method_details.klarna.payment_method_category}')`);}
      for (let i = 0; i < products.length; i++) {
        const item = products[i];
        const itemPriceString = item.price.toString();
        const itemMemory = item.memory.toString();
        client.query(`INSERT INTO orderitems (orderid, productname, quantity, price, color, memory, imageurl) 
                      VALUES('${session.payment_intent}', '${item.product_name}', '${item.quantity}', '${itemPriceString}', '${item.color}', '${itemMemory}', '${item.image_url}')`);
      }
    sendEmail(session.metadata.customeremail, session.metadata.fullname, session.amount/100, products)
    break;
  default:
    console.log(`Unhandled event type ${event.type}`);
}
// Return a 200 response to acknowledge receipt of the event
response.send();
});

module.exports = router;