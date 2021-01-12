import express from "express";
const router = express.Router();
// import controller
import { authUser, getUserProfile } from "../controllers/userController.js";
// import middleware
import { protect } from "../middleware/authMiddleware.js";
router.post("/login", authUser);
// we need to protect the getUserProfile route,
//to implement the protect middleware we need to pass it first
router.route("/profile").get(protect, getUserProfile);
export default router;
