const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.DB_CONNECTION_STRING);
  } catch (error) {
    console.error("MongoDB connection error");
    process.exit(1);
  }
};

module.exports = connectDB;
