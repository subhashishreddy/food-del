import Order from "./../models/orderModel.js";
import User from "./../models/userModel.js";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRETE_KEY);

//place the order function
const placeOrder = async (req, res) => {
  //
  const frontEndUrl = "http://localhost:5174";

  try {
    const newOrder = new Order({
      userId: req.user.userId,
      items: req.body.items,
      amount: req.body.amount,
      address: req.body.address,
    });
    await newOrder.save();
    await User.findByIdAndUpdate(req.user.userId, { cartData: {} });

    const line_items = req.body.items.map((item) => ({
      price_data: {
        currency: "CAD",
        product_data: {
          name: item.name,
        },
        unit_amount: item.price * 100,
      },
      quantity: item.quantity,
    }));
    line_items.push({
      price_data: {
        currency: "CAD",
        product_data: {
          name: "Delivery Charges",
        },
        unit_amount: 2 * 100,
      },
      quantity: 1,
    });

    const session = await stripe.checkout.sessions.create({
      line_items: line_items,
      mode: "payment",
      success_url: `${frontEndUrl}/verify?success=true&orderId=${newOrder._id}`,
      cancel_url: `${frontEndUrl}/verify?success=false&orderId=${newOrder._id}`,
    });

    res.status(200).json({
      status: "success",
      session_url: session.url,
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      status: "success",
      message: "Error",
    });
  }
};

const verifyOrder = async (req, res) => {
  const { orderId, success } = req.body;
  try {
    if (success == "true") {
      await Order.findByIdAndUpdate(orderId, { payment: true });
      res.status(200).json({
        status: "success",
        message: "Paid",
      });
    } else {
      await Order.findByIdAndDelete(orderId);

      res.status(402).json({
        status: "success",
        message: "Not paid",
      });
    }
  } catch (error) {
    console.log(error);
    res.status(404).json({
      status: "failed",
      message: error.message,
    });
  }
};

// user order for frontend

const userOrders = async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user.userId });
    res.status(200).json({
      status: "success",
      data: orders,
    });
  } catch (error) {
    console.log(error);
    res.status(404).json({
      status: "failed",
      message: error.message,
      stack: error.stack,
    });
  }
};

//orders of all users for admin pannel\
const listOrders = async (req, res) => {
  try {
    const orders = await Order.find({});

    res.status(200).json({
      status: "success",
      data: orders,
    });
  } catch (error) {
    console.log(error);
    res.status(404).json({
      status: "failed",
      message: error.message,
      stack: error.stack,
    });
  }
};

//api for updating order status
const updateStatus = async (req, res) => {
  try {
    await Order.findByIdAndUpdate(req.body.orderId, {
      status: req.body.status,
    });

    res.status(200).json({
      status: "success",
      success: true,
      message: "Status updated",
    });
  } catch (error) {
    console.log(error);
    res.status(404).json({
      status: "failed",
      success: false,
      message: error.message,
    });
  }
};

export { placeOrder, verifyOrder, userOrders, listOrders, updateStatus };
