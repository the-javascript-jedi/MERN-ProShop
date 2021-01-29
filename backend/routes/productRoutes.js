import express from "express";
const router = express.Router();
// import controller
import {
  getProducts,
  getProductById,
  deleteProduct,
  updateProduct,
  createProduct,
  createProductReview,
  getTopProducts,
} from "../controllers/productController.js";
// import middleware
import { protect, admin } from "../middleware/authMiddleware.js";
// chain post request for createProduct
router.route("/").get(getProducts).post(protect, admin, createProduct);
// get request for getting the top products
router.get("/top", getTopProducts);
// chain a delete and update request to the route
//pass in the protect and admin middleware and then pass in the deleteProduct or updateProduct function from controller to the route
router
  .route("/:id")
  .get(getProductById)
  .delete(protect, admin, deleteProduct)
  .put(protect, admin, updateProduct);
// add rating and reviews route
router.route("/:id/reviews").post(protect, createProductReview);
export default router;
