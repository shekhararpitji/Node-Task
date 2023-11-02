const express = require("express");
const bcrypt = require("bcryptjs");
const User = require("../models/userRedg");
const { body, validationResult } = require("express-validator");
const router = express.Router();

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
router.post(
  "/",
  [
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
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { username, password, email, firstName, lastName } = req.body;
    const salt = await bcrypt.genSalt(10);
    let hashpassword = await bcrypt.hash(password, salt);

    try {
      const user = new User({
        username,
        password: hashpassword,
        email,
        firstName,
        lastName,
      });

      await user.save();
      res.json({ message: "User registered successfully" });
    } catch (error) {
      console.log(error);
      res.status(500).send("Server Error");
    }
  }
);
module.exports = router;
