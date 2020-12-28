import express from "express";
import dotenv from "dotenv";
import colors from "colors";
import connectDB from "./config/db.js";
//Product routes
import productRoutes from "./routes/productRoutes.js";
//Custom Error Middleware
import { notFound, errorHandler } from "./middleware/errorMiddleware.js";

dotenv.config();
// connect to db
connectDB();
const app = express();
app.get("/", (req, res) => {
  res.send("API is running.....");
});
// mount the product route
app.use("/api/products", productRoutes);
// error message for anything that is not actually a route
app.use(notFound);
// wrong format of product id
app.use(errorHandler);
const PORT = process.env.PORT || 5000;
app.listen(
  PORT,
  console.log(`Server running in ${process.env.NODE_ENV} mode on Port ${PORT}`)
);
