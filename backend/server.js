import express from "express";
import dotenv from "dotenv";
import colors from "colors";
import connectDB from "./config/db.js";
//Product routes
import productRoutes from "./routes/productRoutes.js";
//User Routes
import userRoutes from "./routes/userRoutes.js";
//Order Routes
import orderRoutes from "./routes/orderRoutes.js";
//Custom Error Middleware
import { notFound, errorHandler } from "./middleware/errorMiddleware.js";

dotenv.config();
// connect to db
connectDB();
const app = express();
// this is used for reading the json data from body
app.use(express.json());
app.get("/", (req, res) => {
  res.send("API is running.....");
});
// mount the product route
app.use("/api/products", productRoutes);
//mount the user routes
app.use("/api/users", userRoutes);
// mount the order route
app.use("/api/orders", orderRoutes);
// error message for anything that is not actually a route
app.use(notFound);
// wrong format of product id
app.use(errorHandler);
const PORT = process.env.PORT || 5000;
app.listen(
  PORT,
  console.log(`Server running in ${process.env.NODE_ENV} mode on Port ${PORT}`)
);
