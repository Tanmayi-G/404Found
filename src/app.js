const express = require("express");
const { connectDB } = require("./config/database");
const User = require("./models/user");
require("dotenv").config();
const {
  validateSignUpData,
  validateUserInfoUpdate,
} = require("./utils/validations");
const bcrypt = require("bcrypt");

const app = express();

app.use(express.json());

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

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (isPasswordValid) {
      res.send("Login successful!");
    } else {
      throw new Error("Invalid credentials. Try again.");
    }
  } catch (err) {
    res.status(400).send("Error occurred: " + err.message);
  }
});

app.get("/user", async (req, res) => {
  try {
    const userEmail = req.body.emailId;
    const user = await User.find({ emailId: userEmail });
    if (!user.length) {
      res.status(404).send("User not found");
    } else {
      res.send(user);
    }
  } catch {
    res.send("Something went wrong");
  }
});

app.get("/feed", async (req, res) => {
  try {
    const users = await User.find({});
    if (!users.length) {
      res.status(404).send("No users found");
    } else {
      res.send(users);
    }
  } catch {
    res.send("Something went wrong");
  }
});

app.delete("/user", async (req, res) => {
  try {
    const userId = req.body.userId;
    const user = await User.findByIdAndDelete(userId);
    res.send("User deleted successfully");
  } catch {
    res.status(400).send("Something went wrong");
  }
});

app.patch("/user/:userId", async (req, res) => {
  try {
    //Data validation
    validateUserInfoUpdate(req);

    const userId = req.params?.userId;
    const data = req.body;

    //Update user
    const user = await User.findByIdAndUpdate(userId, data, {
      returnDocument: "after",
      runValidators: true,
    });
    res.send("User updated successfully");
  } catch (err) {
    res.status(400).send("User update failed: " + err.message);
  }
});

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
