const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
  username: { type: String },
  password: String,
});

const User = mongoose.model("User", userSchema);

module.exports = User;
