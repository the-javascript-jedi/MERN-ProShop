import mongoose from "mongoose";
import dotenv from "dotenv";
import colors from "colors";
import products from "./data/products.js";
import users from "./data/user.js";
import User from "./models/userModel.js";
import Product from "./models/productModel.js";
import Order from "./models/orderModel.js";

import connectDB from "./config/db.js";

dotenv.config();
connectDB();
// Create Data
const importData = async () => {
  // mongoose- everything returna a promise
  try {
    //   wipe out the db data
    await Order.deleteMany();
    await Product.deleteMany();
    await User.deleteMany();
    // insert the data
    //created user will be stored in createdUsers variable and for all created users we need to pass the id of admin user
    const createdUsers = await User.insertMany(users);
    // get the first id of the user- for this scenario admin user is in the first item
    const adminUser = createdUsers[0]._id;
    //to all the products map through them and add the admin user
    const sampleProducts = products.map((product) => {
      return { ...product, user: adminUser };
    });
    await Product.insertMany(sampleProducts);
    console.log("Data Imported!".green.inverse);
    process.exit();
  } catch (error) {
    console.error(`${error}`.red.inverse);
    process.exit(1);
  }
};
// Destroy Data
const destroyData = async () => {
  // mongoose- everything returna a promise
  try {
    //   wipe out the db data
    await Order.deleteMany();
    await Product.deleteMany();
    await User.deleteMany();
    // insert the data
    console.log("Data Deleted!".red.inverse);
    process.exit();
  } catch (error) {
    console.error(`${error}`.red.inverse);
    process.exit(1);
  }
};
//delete command node backend/seeder -d
// to get the flag which we are passing to create or destroy data we use argv
if (process.argv[2] === "-d") {
  destroyData();
} else {
  importData();
}
