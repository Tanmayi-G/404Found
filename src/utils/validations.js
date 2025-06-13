const validator = require("validator");

const isSafe = (obj) =>
  Object.keys(obj).every((key) => !key.includes("$") && !key.includes("."));

const validateSignUpData = (req) => {
  if (!isSafe(req.body)) {
    throw new Error("Invalid input detected");
  }

  const { firstName, lastName, emailId, password } = req.body;

  if (!firstName || !lastName) {
    throw new Error("Please enter a valid name");
  } else if (!validator.isEmail(emailId)) {
    throw new Error("Invalid email address");
  } else if (!validator.isStrongPassword(password)) {
    throw new Error(
      "Your password is weak! Password must be at least 8 characters long and include at least 1 uppercase letter, 1 lowercase letter, 1 number, and 1 symbol."
    );
  }
};

const validateUserInfoUpdate = (req) => {
  if (!isSafe(req.body)) {
    throw new Error("Invalid input detected");
  }

  const allowedUpdateFields = [
    "firstName",
    "lastName",
    "photoUrl",
    "gender",
    "age",
    "about",
    "skills",
  ];

  const isUpdateAllowed = Object.keys(req.body).every((field) =>
    allowedUpdateFields.includes(field)
  );

  if (!isUpdateAllowed) {
    throw new Error("Update not allowed");
  }
};

module.exports = {
  validateSignUpData,
  validateUserInfoUpdate,
};
