const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema.Types;

const addressSchema = new mongoose.Schema(
  {
    user_id: {
      type: ObjectId,
      ref: "User",
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    state: {
      type: String,
      required: true,
    },

    pin_code: {
      type: Number,
      required: true,
    },
    phone_no: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);
module.exports = mongoose.model("address", addressSchema);
