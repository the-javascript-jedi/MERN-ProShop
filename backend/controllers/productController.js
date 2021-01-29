import asyncHandler from "express-async-handler";
// import product model
import Product from "../models/productModel.js";
//@desc  Fetch all products
//@route GET /api/products
//@access Public
const getProducts = asyncHandler(async (req, res) => {
  // set a static page size
  const pageSize = 5;
  //find whatever page is in the query
  //if no page is included we are in page 1
  const page = Number(req.query.pageNumber) || 1;

  // search if any keyword is passed in through body for search function
  //req.query is used to get data from the querystring values => products?keyword=
  // if keyword exists
  const keyword = req.query.keyword
    ? {
        name: {
          // search with regex to match keyword with name of the product
          //since we use regex if we search with iph -> iphone is displayed
          $regex: req.query.keyword,
          // case insensitive
          $options: "i",
        },
      }
    : {};
  // get total count of products using count method, we might have a keyword passed so spread the keyword and send it
  const count = await Product.countDocuments({ ...keyword });

  // if empty object is passed a search displays all products, but if specific keyword is passed it returns particular product
  //spread the keyword - either have name or empty object
  //we limit the number of products we are bringing using the pagesize
  const products = await Product.find({ ...keyword })
    .limit(pageSize)
    // skip - .skip(1).limit(2)-If we want to fetch the two documents after the first document from the collection
    .skip(pageSize * (page - 1));
  // //simulate error
  // throw new Error("simulated error!!!");
  //Math.ceil(.95)=>1
  res.json({ products, page, pages: Math.ceil(count / pageSize) });
});

//@desc  Get Top rated products
//@route GET /api/products/top
//@access Public
const getTopProducts = asyncHandler(async (req, res) => {
  // sort({rating:-1})-sort by rating in descending order
  const products = await Product.find({}).sort({ rating: -1 }).limit(3);
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
//@desc  Create new review
//@route POST /api/products/:id/reviews
//@access Private
const createProductReview = asyncHandler(async (req, res) => {
  // get the rating and comment from request.body
  const { rating, comment } = req.body;
  // search if product exists in db
  //use the params passed in the url
  const product = await Product.findById(req.params.id);
  if (product) {
    //  check to see if user has already submitted a review
    //will return true if the user has already provided a review
    const alreadyReviewed = product.reviews.find(
      // for each review check what we added in the product model for review schema and check if that user id is equal to the user id passed in the request
      (r) => r.user.toString() === req.user._id.toString()
    );
    if (alreadyReviewed) {
      res.status(400);
      throw new Error("Product already Reviewed");
    }
    // if review not already added for same product construct a review object
    const review = {
      name: req.user.name,
      rating: Number(rating),
      comment,
      user: req.user._id,
      createdAt: Date.now(),
    };
    // push the review to the products.reviews array
    product.reviews.push(review);
    // calculate the length of the reviews
    product.numReviews = product.reviews.length;
    // calculate overall rating of the product-avg rating take all the ratings of the product and divide by number of reviews
    product.rating =
      product.reviews.reduce((acc, item) => item.rating + acc, 0) /
      product.reviews.length;
    // save the product to db
    await product.save();
    res.status(201).json({
      message: "Review added",
    });
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
  createProductReview,
  getTopProducts,
};
