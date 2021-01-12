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
// pre saving action we need to encrypt the created user password
//we only want to do this if the password field is sent, when we have the update profile functionality and we update our name or email but not the password we dont want this to run else a new password hash will be created and we will not be able to login
userSchema.pre("save", async function (next) {
  //if password is not modified go to next middleware
  if (!this.isModified("password")) {
    next();
  }
  //we need to generate a salt to hash the password asyncronously, we pass the salt as a second argument
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});
const User = mongoose.model("User", userSchema);
export default User;
