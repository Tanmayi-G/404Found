const express = require("express");
const { connectDB } = require("./config/database");
const User = require("./models/user");
require("dotenv").config();

const app = express();

app.use(express.json());

app.post("/signup", async (req, res) => {
  try {
    const data = req.body;

    const isSafe = (obj) =>
      Object.keys(obj).every((key) => !key.includes("$") && !key.includes("."));
    if (!isSafe(data)) {
      return res.status(400).send("Invalid input detected");
    }

    const user = new User(data);
    await user.save();
    res.send("User added successfully");
  } catch (err) {
    res.status(400).send("Error adding the user" + err.message);
  }
});

app.get("/user", async (req, res) => {
  try {
    const userEmail = req.body.emailId;
    const user = await User.find({ emailId: userEmail });
    if (!user) {
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
    if (!users) {
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
    const userId = req.params?.userId;
    const data = req.body;

    const isSafe = (obj) =>
      Object.keys(obj).every((key) => !key.includes("$") && !key.includes("."));
    if (!isSafe(data)) {
      return res.status(400).send("Invalid input detected");
    }

    const ALLOWED_UPDATES = [
      "password",
      "age",
      "gender",
      "photoUrl",
      "about",
      "skills",
    ];

    const isUpdateAllowed = Object.keys(data).every((key) =>
      ALLOWED_UPDATES.includes(key)
    );
    if (!isUpdateAllowed) {
      throw new Error("Update not allowed");
    }
    const user = await User.findByIdAndUpdate(userId, data, {
      returnDocument: "after",
      runValidators: true,
    });
    console.log(user);
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
