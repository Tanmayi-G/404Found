const express = require("express");
const connectDB = require("./config/database");
const User = require("./models/user");
const { validateSignUpData, validateUserInfoUpdate } = require("./utils/validations");
require("dotenv").config();
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const { userAuth } = require("./middlewares/auth");

const app = express();

app.use(express.json());
app.use(cookieParser());

app.post("/signup", async (req, res) => {
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

app.post("/login", async (req, res) => {
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

app.get("/profile", userAuth, async (req, res) => {
  try {
    const user = req.user;
    res.send(user);
  } catch (err) {
    res.status(400).send("Error occurred: " + err.message);
  }
});

// app.patch("/user/:userId", async (req, res) => {
//   try {
//     //Data validation
//     validateUserInfoUpdate(req);

//     const userId = req.params?.userId;
//     const data = req.body;

//     //Update user
//     const user = await User.findByIdAndUpdate(userId, data, {
//       returnDocument: "after",
//       runValidators: true,
//     });
//     res.send("User updated successfully");
//   } catch (err) {
//     res.status(400).send("User update failed: " + err.message);
//   }
// });

connectDB()
  .then(() => {
    console.log("Database connection established");
    app.listen(process.env.PORT, () => {
      console.log("Server is listening on port " + process.env.PORT);
    });
  })
  .catch((err) => {
    console.error("Database connection failed");
  });
