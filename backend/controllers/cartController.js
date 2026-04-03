import User from "../models/userModel.js";

//add items to user cart
const addToCart = async (req, res) => {
  try {
    let userData = await User.findById(req.user.userId);
    let cartData = userData.cartData;
    if (!cartData[req.body.itemId]) {
      cartData[req.body.itemId] = 1;
    } else {
      cartData[req.body.itemId] += 1;
    }
    await User.findByIdAndUpdate(req.user.userId, { cartData });
    res.status(200).json({
      status: "success",
      message: "added To Cart",
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      status: "failed",
      message: error.message,
    });
  }
};

//remove items from the user cart
const removeFromCart = async (req, res) => {
  try {
    let userData = await User.findById(req.user.userId);
    let cartData = userData.cartData;
    if (cartData[req.body.itemId] > 0) {
      cartData[req.body.itemId] -= 1;
    }

    userData.markModified("cartData");
    await userData.save();
    res.status(200).json({
      status: "success",
      message: "Removed From Cart",
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      status: "failed",
      message: error.message,
    });
  }
};

//fetch user cart data
const getCart = async (req, res) => {
  try {
    const userData = await User.findById(req.user.userId);
    let cartData = userData.cartData;
    res.status(200).json({
      status: "success",
      cartData,
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      status: "failed",
      message: error.message,
    });
  }
};

export { addToCart, removeFromCart, getCart };
