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

//@desc  Get order by ID
//@route POST /api/orders/:id
//@access Private
const getOrderbyId = asyncHandler(async (req, res) => {
  // in addition to the user's order info we also need to get the user's name and email associated with this order
  //first argument is user collection // second argument is a space separated field of fields we want eg(name email)
  const order = await Order.findById(req.params.id).populate(
    "user",
    "name email isAdmin password rating"
  );
  if (order) {
    res.json(order);
  } else {
    res.status(404);
    throw new Error("Order not found");
  }
});
//@desc  Update Order to Paid
//@route POST /api/orders/:id/pay
//@access Private
const updateOrderToPaid = asyncHandler(async (req, res) => {
  //find the order by id
  const order = await Order.findById(req.params.id);
  if (order) {
    order.isPaid = true;
    order.paidAt = Date.now();
    order.paymentResult = {
      // the id, status, update_time and payer.email_address will be received from the paypal api which can be got from the request body
      id: req.body.id,
      status: req.body.status,
      update_time: req.body.update_time,
      email_address: req.body.payer.email_address,
    };
    // save the set values
    const updatedOrder = await order.save();
    // send back the updated order
    res.json(updatedOrder);
  } else {
    res.status(404);
    throw new Error("Order not found");
  }
});
export { addOrderItems, getOrderbyId, updateOrderToPaid };
