// path -nodejs module to work with file paths
import path from "path";
import express from "express";
import dotenv from "dotenv";
import colors from "colors";
import morgan from "morgan";

import connectDB from "./config/db.js";
//Product routes
import productRoutes from "./routes/productRoutes.js";
//User Routes
import userRoutes from "./routes/userRoutes.js";
//Order Routes
import orderRoutes from "./routes/orderRoutes.js";
//Upload Image Routes
import uploadRoutes from "./routes/uploadRoutes.js";
//Custom Error Middleware
import { notFound, errorHandler } from "./middleware/errorMiddleware.js";

dotenv.config();
// connect to db
connectDB();
const app = express();
// use mogan middleware in development for logging purpose
if (process.env.NODE_ENV === "development") {
  // we can pass in different arguments
  app.use(morgan("dev"));
}
// this is used for reading the json data from body
app.use(express.json());

// mount the product route
app.use("/api/products", productRoutes);
//mount the user routes
app.use("/api/users", userRoutes);
// mount the order route
app.use("/api/orders", orderRoutes);
//mount the upload route
app.use("/api/upload", uploadRoutes);
// paypal route
// when we are ready to make the payment we will hit the below paypal route and get the client id
app.get("/api/config/paypal", (req, res) =>
  res.send(process.env.PAYPAL_CLIENT_ID)
);
// make uploads folder static so that it can get loaded in the browser
// __dirname - points to current directory -- only available if we use require syntax
//workaround to make __dirname point to current path in ES6 module syntax
const __dirname = path.resolve();
//  express.static(path.join(__dirname, "/uploads")) - takes to uploads folder and makes it static
//from there we goto /uploads
app.use("/uploads", express.static(path.join(__dirname, "/uploads")));
// make the /frontend/build folder as static
if (process.env.NODE_ENV === "production") {
  // set the build folder to a static folder
  app.use(express.static(path.join(__dirname, "/frontend/build")));
  // anything that is not our api routes will point to our index.html in build folder
  app.get("*", (req, res) =>
    // res.sendFile - transfer the file at the given path - point to index.html
    res.sendFile(path.resolve(__dirname, "frontend", "build", "index.html"))
  );
} else {
  app.get("/", (req, res) => {
    res.send("API is running.....");
  });
}

// error message for anything that is not actually a route
app.use(notFound);
// wrong format of product id
app.use(errorHandler);
const PORT = process.env.PORT || 5000;
app.listen(
  PORT,
  console.log(`Server running in ${process.env.NODE_ENV} mode on Port ${PORT}`)
);
