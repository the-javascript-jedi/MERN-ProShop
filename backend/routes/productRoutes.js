import express from "express";
const router = express.Router();
// import controller
import {
  getProducts,
  getProductById,
  deleteProduct,
  updateProduct,
  createProduct,
} from "../controllers/productController.js";
// import middleware
import { protect, admin } from "../middleware/authMiddleware.js";
// chain post request for createProduct
router.route("/").get(getProducts).post(protect, admin, createProduct);
// chain a delete and update request to the route
//pass in the protect and admin middleware and then pass in the deleteProduct or updateProduct function from controller to the route
router
  .route("/:id")
  .get(getProductById)
  .delete(protect, admin, deleteProduct)
  .put(protect, admin, updateProduct);

export default router;
