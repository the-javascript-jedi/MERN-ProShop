import express from "express";
const router = express.Router();
// import controller
import {
  authUser,
  registerUser,
  getUserProfile,
  updateUserProfile,
} from "../controllers/userController.js";
// import middleware
import { protect } from "../middleware/authMiddleware.js";
router.post("/login", authUser);
// create user route
router.route("/").post(registerUser);
// we need to protect the getUserProfile route,
//to implement the protect middleware we need to pass it first
// we chain the put method for updating the user profile
router
  .route("/profile")
  .get(protect, getUserProfile)
  .put(protect, updateUserProfile);
export default router;
