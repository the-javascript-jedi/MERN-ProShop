import jwt from "jsonwebtoken";
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    //token expires in 30 days
    expiresIn: "30d",
  });
};
export default generateToken;
