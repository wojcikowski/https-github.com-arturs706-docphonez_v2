const express = require('express');
const cors = require('cors');
require('dotenv').config();
const PORT = process.env.PORT || 10000;
const app = express();
const paymentRouter = require('./routers/stripecheckout');
const paymentIntent = require('./routers/paymentintent');
const usersRouter = require('./routers/users');
const authRouter = require('./routers/auth');
const orderRouter = require('./routers/orders');
const productRouter = require('./routers/products');
const cookieParser = require('cookie-parser');


const corsOptions = {
    origin: ['http://localhost:3000', 'https://doctorphonez.co.uk'],
    credentials: true,
    optionSuccessStatus: 200
}

app.use(cookieParser());
app.use(cors(corsOptions));
app.use('/api/v1/', paymentRouter)
app.use('/api/v1/', paymentIntent);
app.use('/api/v1/', usersRouter);
app.use('/api/v1', authRouter);
app.use('/api/v1', orderRouter);
app.use('/api/v1/products', productRouter);

app.listen(PORT, () => {
    console.log(`Server running on port ` + PORT);
    }
);


