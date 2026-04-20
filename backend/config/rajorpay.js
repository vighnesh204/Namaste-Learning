const Rajorpay = require('razorpay');
require('dotenv').config();

exports.instance = process.env.RAZORPAY_KEY ? new Rajorpay({
    key_id: process.env.RAZORPAY_KEY,
    key_secret: process.env.RAZORPAY_SECRET
}) : null;