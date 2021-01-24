import jwt from "jsonwebtoken";
import asyncHandler from "express-async-handler";
import User from "../models/userModel.js";
// we need to validate the token here and if the token is valid we assign the user data(id,name,email,isAdmin) to the req.user
const protect = asyncHandler(async (req, res, next) => {
  let token;
  // access the header
  // console.log("req.headers.authorization", req.headers.authorization);
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];
      // decode the token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log("decoded token", decoded);
      // .select("-password") - minus password is passed so that except password the other information will be stored in req.user ie id,name,email,isAdmin
      req.user = await User.findById(decoded.id).select("-password");
      console.log("req.user", req.user);
      //   since this is middleware we need to call next()
      next();
    } catch (error) {
      console.error(error);
      res.status(401);
      throw new Error("Error--Not authorized, token failed");
    }
  }
  // throw error if no token is present
  if (!token) {
    res.status(401);
    throw new Error("Error--Not authorized, no token");
  }
});

const admin = (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    next();
  } else {
    res.status(401);
    throw new Error("Not Authorized as an admin--authMiddleware.js");
  }
};
export { protect, admin };
