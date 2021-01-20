import express from "express";
const router = express.Router();
// import controller
import { addOrderItems, getOrderbyId } from "../controllers/orderController.js";
// import middleware
import { protect } from "../middleware/authMiddleware.js";
// create new order route
// we need to protect the addOrderItems route,
//to implement the protect middleware we need to pass it first
router.route("/").post(protect, addOrderItems);
// make sure when we pass this id as param we need to keep it in the bottom else if we pass /somethingelse it will take the something else value as an id
router.route("/:id").get(protect, getOrderbyId);
export default router;
