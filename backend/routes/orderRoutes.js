import express from "express";
const router = express.Router();
// import controller
import {
  addOrderItems,
  getOrderbyId,
  updateOrderToPaid,
  getMyOrders,
  updateOrderToDelivered,
  getOrders,
} from "../controllers/orderController.js";
// import middleware
import { protect, admin } from "../middleware/authMiddleware.js";
// create new order route
// we need to protect the addOrderItems route,
//to implement the protect middleware we need to pass it first
// we chanin the get request and pass in the protect and admin routes respectively
router.route("/").post(protect, addOrderItems).get(protect, admin, getOrders);
//route to calculate user orders
router.route("/myorders").get(protect, getMyOrders);
// make sure when we pass this id as param we need to keep it in the bottom else if we pass /somethingelse it will take the something else value as an id
router.route("/:id").get(protect, getOrderbyId);
// update the order to paid
router.route("/:id/pay").put(protect, updateOrderToPaid);
// update the order to delivered
router.route("/:id/deliver").put(protect, admin, updateOrderToDelivered);
export default router;
