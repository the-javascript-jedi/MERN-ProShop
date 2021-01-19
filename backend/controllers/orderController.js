import asyncHandler from "express-async-handler";
// import order model
import Order from "../models/orderModel.js";
//@desc  Create new order
//@route POST /api/orders
//@access Private
const addOrderItems = asyncHandler(async (req, res) => {
  const {
    orderItems,
    shippingAddress,
    paymentMethod,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
  } = req.body;
  // check if order items is present
  if (orderItems && orderItems.length === 0) {
    res.status(400);
    throw new Error("No Order Items");
    return;
  } else {
    // create a new order in db
    const order = new Order({
      orderItems,
      //attach the logged in user cause this is a protected route so we will be able to get a token and get the user id from the token
      user: req.user._id,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
    });
    // save to db
    const createdOrder = await order.save();
    res.status(201).json(createdOrder);
  }
});
export { addOrderItems };
