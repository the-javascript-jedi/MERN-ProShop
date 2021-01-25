import express from "express";
const router = express.Router();
// import controller
import {
  getProducts,
  getProductById,
  deleteProduct,
} from "../controllers/productController.js";
// import middleware
import { protect, admin } from "../middleware/authMiddleware.js";
router.route("/").get(getProducts);
// chain a delete request to the route
//pass in the protect and admin middleware and then pass in the deleteProduct function from controller to the route
router.route("/:id").get(getProductById).delete(protect, admin, deleteProduct);

export default router;
