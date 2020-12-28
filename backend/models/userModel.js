import mongoose from "mongoose";

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
const User = mongoose.model("User", userSchema);
export default User;
