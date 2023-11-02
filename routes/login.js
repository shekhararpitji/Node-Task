const express = require("express");
const router = express.Router();
const User = require("../models/userRedg");
const bcrypt = require("bcryptjs");
const { body, validationResult } = require("express-validator");

router.post(
  "/",[body("username").notEmpty(), body("password").notEmpty()], async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { username, password } = req.body;

    try {
      const user = await User.findOne({ username: username });

      if (!user) {
        return res.status(400).json({ message: "Invalid credentials" });
      }

      let check = bcrypt.compareSync(password, user.password);
      if (check) {
        console.log("password was true");
      } else {
        return res.status(400).json({ message: "Invalid credentials" });
      }

      const access_token = user._id;

      res.json({ access_token });
    } catch (error) {
      console.error(error);
      res.status(500).send("Server Error");
    }
  }
);

module.exports = {router,access_token};
