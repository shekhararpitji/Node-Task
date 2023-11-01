const mongoose = require("mongoose");

const tokenSchema = new mongoose.Schema(
  {
    username: String,
    access_token: String,
    expiry:Number
  },
  { timestamps: true }
);

module.exports = mongoose.model("UserToken", tokenSchema);
