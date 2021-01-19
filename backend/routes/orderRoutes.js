import express from "express";
const router = express.Router();
// import controller
import { addOrderItems } from "../controllers/orderController.js";
// import middleware
import { protect } from "../middleware/authMiddleware.js";
// create new order route
// we need to protect the addOrderItems route,
//to implement the protect middleware we need to pass it first
router.route("/").post(protect, addOrderItems);
export default router;
