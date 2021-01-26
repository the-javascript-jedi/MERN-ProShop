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
//@desc  Create a Product
//@route POST /api/products/
//@access Private/Admin
const createProduct = asyncHandler(async (req, res) => {
  const product = new Product({
    name: "Sample name",
    price: 1,
    user: req.user._id,
    image: "/images/sample.jpg",
    brand: "Sample Brand",
    category: "Sample Category",
    countInStock: 1,
    numReviews: 0,
    description: "Sample Description",
  });
  // create product with sample data
  const createdProduct = await product.save();
  // respond with the created product
  res.status(201).json(createdProduct);
});
//@desc  Update a Product
//@route PUT /api/products/:id
//@access Private/Admin
const updateProduct = asyncHandler(async (req, res) => {
  const {
    name,
    price,
    description,
    image,
    brand,
    category,
    countInStock,
  } = req.body;
  // search if product exists in db
  const product = await Product.findById(req.params.id);
  if (product) {
    // set the db fields to the request body fields
    product.name = name;
    product.price = price;
    product.description = description;
    product.image = image;
    product.brand = brand;
    product.category = category;
    product.countInStock = countInStock;
    // update product with request body data
    const updatedProduct = await product.save();
    // respond with the updated data
    res.status(201).json(updatedProduct);
  } else {
    res.status(404);
    throw new Error("Product Not Found");
  }
});
export {
  getProducts,
  getProductById,
  deleteProduct,
  createProduct,
  updateProduct,
};
