import asyncHandler from "express-async-handler";
// import product model
import Product from "../models/productModel.js";
//@desc  Fetch all products
//@route GET /api/products
//@access Public
const getProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({});
  // //simulate error
  // throw new Error("simulated error!!!");
  res.json(products);
});
//@desc  Fetch single product
//@route GET /api/products/:id
//@access Public
const getProductById = asyncHandler(async (req, res) => {
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
});
//@desc  Delete a Product
//@route DELETE /api/products/:id
//@access Private/Admin
const deleteProduct = asyncHandler(async (req, res) => {
  // find the product
  const product = await Product.findById(req.params.id);
  if (product) {
    // remove the product from db
    await product.remove();
    res.json({ message: "Product Removed" });
  } else {
    res.status(404);
    throw new Error("Product Not Found");
  }
});
export { getProducts, getProductById, deleteProduct };
