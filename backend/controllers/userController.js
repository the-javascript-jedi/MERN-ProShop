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
export { authUser, getUserProfile, registerUser, updateUserProfile };
