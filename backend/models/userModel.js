import mongoose from "mongoose";
import bcrypt from "bcryptjs";
const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    isAdmin: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  //   second argument timestamps will create a timestamp field automatically i.e(created at)
  {
    timestamps: true,
  }
);
// this method is called from the userController
userSchema.methods.matchPassword = async function (enteredPassword) {
  //use bcrypt to check if the entered plain text password matches the encrypted password in db
  //this.password can be used to get the password from the schema
  //returns true or false if password matches
  return await bcrypt.compare(enteredPassword, this.password);
};
const User = mongoose.model("User", userSchema);
export default User;
