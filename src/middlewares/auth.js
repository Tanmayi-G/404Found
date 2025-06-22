const jwt = require("jsonwebtoken");
const User = require("../models/user");

const userAuth = async (req, res, next) => {
  try {
    const { token } = req.cookies;
    if (!token) {
      return res.status(401).send("Please login!");
    }

    const decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY);
    const { _id } = decodedToken;

    const user = await User.findById(_id);
    if (!user) {
      throw new Error("User not found. Token may be invalid or user no longer exists.");
    }
    req.user = user;
    next();
  } catch (err) {
    res.status(400).send("Error occurred: " + err.message);
  }
};

module.exports = { userAuth };
