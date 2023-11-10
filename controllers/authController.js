const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const multer  = require('multer')
const Email= require("../utils/emailUtil")


exports.forgetPassController = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ "email":email });
    
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const resetToken = jwt.sign({ _id: user._id }, process.env.JWT_RESET_KEY, {
      expiresIn: "15m",
    });

    await User.updateOne(
      { email },
      { $set: { resetToken: resetToken } }
    );
    Email.passwordResetMail(email, resetToken);
    res.status(200).send(user.email);
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
};

exports.resetPassword=async(req,res)=>{
    try{
    const reset_token=req.params.resetToken;
    const {password,confirmPassword}=req.body;
    const user = await User.findOne({ "resetToken":reset_token});
    
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    if(password!==confirmPassword){
        return res.status(400).json({ message: "Password not match" });
    }
    const newUser= await User.updateOne(
        { "resetToken":reset_token },
        { $set: { "resetToken": "",
        "password": password } }
      );
      res.status(200).send(newUser);


} catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }

}

exports.profileImageController=(req,res)=>{
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No image provided" });
    }
    res.json({ message: "Profile image uploaded successfully" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}