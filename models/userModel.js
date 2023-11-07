const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema.Types;

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique:true
    },
    password: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique:true
    },
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    } ,
    addresses: [
      {
        type: ObjectId,
        ref: "address",
      },
    ],
    resetToken: {
      type: String,
      default: "",
    }
   }
  ,
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
