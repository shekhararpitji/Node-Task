const mongoose = require("mongoose");
const addressSchema = new mongoose.Schema(
  {
    user_id: String,
    address: String,
    city: String,
    state: String,
    pin_code: String,
    phone_no: String,
  },
  { timestamps: true }
);
module.exports = mongoose.model("address", addressSchema);
