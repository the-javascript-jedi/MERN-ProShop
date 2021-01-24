import asyncHandler from "express-async-handler";
// import jwt token creator
import generateToken from "../utils/generateToken.js";
// import user model
import User from "../models/userModel.js";
//@desc  Auth User &get token
//@route POST /api/users/login
//@access Public
const authUser = asyncHandler(async (req, res) => {
  // when we set a form and send from the front end we can access the body of request
  const { email, password } = req.body;
  // find user one document which matches the email
  const user = await User.findOne({ email });
  // check if user exists and make sure password sent in request matches the user's password in db
  //we send a plain text password but the password in db is encrypted so we need to use bcrypt
  //we do this check inthe schema using schema.methods.<function_name> syntax
  if (user && (await user.matchPassword(password))) {
    //   we can check the password check in the model
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      // the token will have the user's id embedded in it
      token: generateToken(user._id),
    });
  } else {
    res.status(401);
    throw new Error("Invalid email or password");
  }
});
//@desc  Get user profile
//@route GET /api/users/profile
//@access Private
const getUserProfile = asyncHandler(async (req, res) => {
  //find the user by id
  //(req.user._id)-logged in user
  const user = await User.findById(req.user._id);
  // res.send("Success");
  if (user) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
    });
  } else {
    res.status(401);
    throw new Error("Invalid Email or password");
  }
});
//@desc  Update user profile
//@route PUT /api/users/profile
//@access Private
// this below route will require a token from the front end
const updateUserProfile = asyncHandler(async (req, res) => {
  //find the user by id
  //(req.user._id)-logged in user
  const user = await User.findById(req.user._id);
  // res.send("Success");
  if (user) {
    // if the request contains an updated value in req.body use the updated value from request,
    // if the updated value is not present in req.body use existing value
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    if (req.body.password) {
      // password is encrypted automatically since we are using a middleware .pre('save') before saving the password
      user.password = req.body.password;
    }
    // save the updated user
    const updatedUser = await user.save();
    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      isAdmin: updatedUser.isAdmin,
      // the token will have the user's id embedded in it
      token: generateToken(user._id),
    });
  } else {
    res.status(404);
    throw new Error("Error-User Not Found");
  }
});
//@desc  Register a new user
//@route POST /api/users
//@access Public
const registerUser = asyncHandler(async (req, res) => {
  //if user already exists throw an error
  const { name, email, password } = req.body;
  // find user one document which matches the email
  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400);
    throw new Error("User already exists");
  }
  // User.create is syntactic sugar for schema.save
  const user = await User.create({
    name,
    email,
    password,
  });
  if (user) {
    // we respond with the created user data as well as the generated token so we can authenticate the user
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      // the token will have the user's id embedded in it
      token: generateToken(user._id),
    });
  } else {
    res.status(400);
    throw new Error("Error--Invalid user data");
  }
});
//@desc  Get all users
//@route GET /api/users
//@access Private/Admin
const getUsers = asyncHandler(async (req, res) => {
  //find all users - we just pass an empty object to get all users
  const users = await User.find({});
  // console.log("users--getUsers--userController.js", users);
  res.json(users);
});
//@desc Delete user
//@route DELETE /api/users/:id
//@access Private/Admin
const deleteUser = asyncHandler(async (req, res) => {
  //find user to delete - findById passed in the route
  const user = await User.findById(req.params.id);
  if (user) {
    await user.remove();
    res.json({ message: "User removed" });
  } else {
    res.status(404);
    throw new Error("User Not Found");
  }
});
// only admin can view all the user details
//@desc get user by ID
//@route GET /api/users/:id
//@access Private/Admin
const getUserById = asyncHandler(async (req, res) => {
  // send the user back without the password
  const user = await User.findById(req.params.id).select("-password");
  if (user) {
    res.json(user);
  } else {
    res.status(404);
    throw new Error("User Not Found");
  }
});
//@desc Update the user for edit user
//@route PUT /api/users/:id
//@access Private/Admin
const updateUser = asyncHandler(async (req, res) => {
  console.log("req-updateUser--userController.js", req);
  const user = await User.findById(req.params.id);
  if (user) {
    // if no data is present use the data in db
    user.name = req.body.name || user;
    user.body = req.body.email || user;
    // check if admin value is passed in the request else save isAdmin as false by default
    if (req.body.isAdmin) {
      user.isAdmin = req.body.isAdmin;
    } else {
      user.isAdmin = false;
    }
    // save the updated user with the updated values
    const updatedUser = await user.save();
    // return the updated data
    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      isAdmin: updatedUser.isAdmin,
    });
  } else {
    res.status(404);
    throw new Error("User Not Found");
  }
});
export {
  authUser,
  getUserProfile,
  registerUser,
  updateUserProfile,
  getUsers,
  deleteUser,
  getUserById,
  updateUser,
};
