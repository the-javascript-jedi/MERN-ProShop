import express from "express";
import asyncHandler from "express-async-handler";
const router = express.Router();
// import product model
import Product from "../models/productModel.js";
//@desc  Fetch all products
//@route GET /api/products
//@access Public
router.get(
  "/",
  asyncHandler(async (req, res) => {
    const products = await Product.find({});
    // //simulate error
    // throw new Error("simulated error!!!");
    res.json(products);
  })
);
//@desc  Fetch single product
//@route GET /api/products/:id
//@access Public
router.get(
  "/:id",
  asyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id);
    // console.log("product-backend", product);
    if (product) {
      res.json(product);
    } else {
      //manual error message
      // res.status(404).json({ message: "Product not found!!!" });
      /////
      //custom error message
      res.status(404);
      throw new Error("Product Not Found");
    }
  })
);
export default router;
