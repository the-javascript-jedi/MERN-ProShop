import express from "express";
const router = express.Router();
// import controller
import {
  authUser,
  registerUser,
  getUserProfile,
  updateUserProfile,
  getUsers,
  deleteUser,
  getUserById,
  updateUser,
} from "../controllers/userController.js";
// import middleware
import { protect, admin } from "../middleware/authMiddleware.js";
router.post("/login", authUser);
// create user route
//for the same route ('/') we can chain a .get request
//add the admin middleware as a second argument to the .get method
router.route("/").post(registerUser).get(protect, admin, getUsers);
// we need to protect the getUserProfile route,
//to implement the protect middleware we need to pass it first
// we chain the put method for updating the user profile
router
  .route("/profile")
  .get(protect, getUserProfile)
  .put(protect, updateUserProfile);
// delete route
//we chain the get and put request for getUserById,updateUser respectively
//we add protect and admin access middleware
router
  .route("/:id")
  .delete(protect, admin, deleteUser)
  .get(protect, admin, getUserById)
  .put(protect, admin, updateUser);

export default router;
