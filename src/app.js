const express = require("express");
const { connectDB } = require("./config/database");
const User = require("./models/user");
require("dotenv").config();

const app = express();

app.post("/signup", async (req, res) => {
  //mockData
  const user = new User({
    firstName: "Tanmayi",
    lastName: "G",
    emailId: "tanmayiig@gmail.com",
    password: "tanmayi@2004",
  });

  try {
    await user.save();
    res.send("User added successfully");
  } catch (err) {
    res.status(400).send("Error adding the user" + err.message);
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
