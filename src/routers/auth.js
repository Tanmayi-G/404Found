const express = require("express");
const { validateSignUpData } = require("../utils/validations");
const bcrypt = require("bcrypt");
const User = require("../models/user");

const authRouter = express.Router();

authRouter.post("/signup", async (req, res) => {
  try {
    //Data validation
    validateSignUpData(req);

    const { firstName, lastName, emailId, password } = req.body;

    //Password encryption
    const passwordHash = await bcrypt.hash(password, 10);

    //Store user
    const user = new User({
      firstName,
      lastName,
      emailId,
      password: passwordHash,
    });
    await user.save();

    res.send("User added successfully");
  } catch (err) {
    res.status(400).send("Error occurred: " + err.message);
  }
});

authRouter.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;

    if (!emailId || !password) {
      throw new Error("Email ID and password are required to login.");
    }

    const user = await User.findOne({ emailId: emailId });
    if (!user) {
      throw new Error("Invalid credentials. Try again.");
    }

    const isPasswordValid = await user.validatePassword(password);
    if (isPasswordValid) {
      //passing JWT token
      const token = user.getJWT();
      res.cookie("token", token, { expires: new Date(Date.now() + 7 * 24 * 3600000) }); //expires after 7 days

      res.send("Login successful!");
    } else {
      throw new Error("Invalid credentials. Try again.");
    }
  } catch (err) {
    res.status(400).send("Error occurred: " + err.message);
  }
});

module.exports = authRouter;
