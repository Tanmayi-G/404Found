const mongoose = require("mongoose");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      minLength: 3,
      maxLength: 50,
      trim: true,
    },
    lastName: {
      type: String,
      required: true,
      minLength: 1,
      maxLength: 50,
      trim: true,
    },
    emailId: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error("Invalid email address: " + value);
        }
      },
    },
    password: {
      type: String,
      required: true,
      validate(value) {
        if (!validator.isStrongPassword(value)) {
          throw new Error("Password must be at least 8 characters long and include at least 1 uppercase letter, 1 lowercase letter, 1 number, and 1 symbol");
        }
      },
    },
    age: {
      type: Number,
      min: [18, "Age must be at least 18"],
    },
    gender: {
      type: String,
      enum: {
        values: ["Male", "Female", "Other", ""],
        message: `Invalid gender: {VALUE}`,
      },
    },
    photoUrl: {
      type: String,
      default: "https://cdn.pixabay.com/photo/2023/02/18/11/00/icon-7797704_1280.png",
      validate(value) {
        if (!validator.isURL(value)) {
          throw new Error("Invalid photo URL: " + value);
        }
      },
    },
    about: {
      type: String,
      maxLength: [200, "About section must be under 200 characters"],
      default: "Hi there! I'm new here. Let's connect and build something great!",
      trim: true,
    },
    skills: {
      type: [String],
      validate: {
        validator: (arr) => arr.length <= 10,
        message: "You can add up to 10 skills only",
      },
    },
  },
  {
    timestamps: true,
  }
);

userSchema.methods.getJWT = function () {
  const user = this;
  const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET_KEY, { expiresIn: "1d" }); //expires after 1 day
  return token;
};

userSchema.methods.validatePassword = async function (inputPassword) {
  const user = this;
  const passwordHash = user.password;
  const isPasswordValid = await bcrypt.compare(inputPassword, passwordHash);
  return isPasswordValid;
};

const User = mongoose.model("User", userSchema);

module.exports = User;
