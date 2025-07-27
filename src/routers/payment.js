const express = require("express");
const { userAuth } = require("../middlewares/auth");
const razorpayInstance = require("../utils/razorpay");
const Payment = require("../models/payment");
const { membershipAmounts } = require("../utils/constants");

const paymentRouter = express.Router();

paymentRouter.post("/payment/createOrder", userAuth, async (req, res) => {
  try {
    const { membershipType } = req.body;
    const { firstName, lastName, emailId } = req.user;

    //request razorpay to create order (secret key in razorpay instance)
    const order = await razorpayInstance.orders.create({
      amount: membershipAmounts[membershipType] * 100,
      currency: "INR",
      receipt: "receipt#1",
      notes: {
        firstName,
        lastName,
        emailId,
        membershipType,
      },
    });

    //save to database
    const payment = new Payment({
      userId: req.user._id,
      orderId: order.id,
      status: order.status,
      amount: order.amount,
      currency: order.currency,
      receipt: order.receipt,
      notes: order.notes,
    });

    const savedPayment = await payment.save();

    //send back to FE
    res.json({ ...savedPayment.toJSON() });
  } catch (err) {}
});

module.exports = paymentRouter;
