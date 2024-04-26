const jwt = require("jsonwebtoken");
require("dotenv").config();

const jwtAuthMiddleware = (req, res, next) => {
  const token = req.header.authorization.split(" ")[1];
  if (!token) {
    return res.status(401).json({ error: "unauthorized" });
  }
  try {
    //VERIFY THE JWT TOKEN
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    //ATTACH USER INFORMATION TO THE REQUEST OBJECT:
    req.user = decoded;
    next();
  } catch (err) {
    console.log(err);
    res.status(401).json({ error: "Invalid Token" });
  }
};
//functions to generate the jwt token:
const generateToken = (userData) => {
  return jwt.sign(userData, process.env.JWT_SECRET);
};
module.exports = { jwtAuthMiddleware, generateToken };
