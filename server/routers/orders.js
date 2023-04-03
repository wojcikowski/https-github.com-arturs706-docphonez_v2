const client = require('../db/conn')
const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const authenticateToken = require('../middleware/authz')



const RETRIEVE_ORDERS = `SELECT * from userorders WHERE useremail = $1;`

const RETRIEVE_ORDER_ITEMS = `SELECT productname, quantity, price, color, memory, imageurl FROM orderitems WHERE orderid = $1;`

router.get('/orders', authenticateToken, async (req, res) => {
    try {
        const userorders = await client.query(RETRIEVE_ORDERS, [req.user.email]);
        const orders = userorders.rows.map(async (order) => {
            const orderitems = await client.query(RETRIEVE_ORDER_ITEMS, [order.orderid]);
            return {
                ...order,
                items: orderitems.rows
            };
        });
        const ordersWithItems = await Promise.all(orders);
        res.status(200).json({ orders: ordersWithItems });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Something went wrong' });
    }
});


module.exports = router;