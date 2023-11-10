const { body } = require("express-validator");
const User = require("../models/userModel");
const UserToken = require("../models/tokenModel");
const jwt = require("jsonwebtoken");

const isUsernameUnique = async (username) => {
  const isUserPresent = await User.findOne({ username: username });
  if (isUserPresent !== null) {
    res.send("username already existt");
    return true;
  }

  return false;
};
const isEmailUnique = async (email) => {
  const isUserPresent = await User.findOne({ email: email });
  if (isUserPresent !== null) {
    res.send("user already present");
    return true;
  }

  return false;
};
exports.redgMiddle = [
  body("username")
    .custom(isUsernameUnique)
    .withMessage("Username is already taken")
    .isLength({ min: 4 })
    .withMessage("Username must be at least 4 characters long"),

  body("email")
    .custom(isEmailUnique)
    .withMessage("Email is already registered")
    .isEmail()
    .withMessage("Invalid email"),

  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),

  body("confirmPassword")
    .custom((value, { req }) => value === req.body.password)
    .withMessage("Passwords do not match"),
];

exports.authMiddle = async (req, res, next) => {
  try {
    const access_token = req.get("authorization").split(" ")[1];
    const userToken = await UserToken.findOne({ access_token: access_token });
    if (!userToken) {
      return res.status(401).send("Invalid access_token");
    }
    const decoded = jwt.verify(access_token, process.env.SECRET);
    if (decoded.userId) {
      next();
    } else {
      res.status(401).json({ message: "Unauthorized" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send("Server Error");
  }
};

exports.loginMiddle = [
  body("username").notEmpty(),
  body("password").notEmpty(),
];
