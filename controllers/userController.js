const { validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const bcrypt = require("bcryptjs");
const tokenModel = require("../models/tokenModel");
const Address = require("../models/addressModel");
const UserToken = require("../models/tokenModel");

exports.loginController = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const { username,password } = req.body;

  try {
    const user = await User.findOne({ username: username });
    if (!user) {
      return res.status(404 ).json({ message: "username not found" });
    }
    const check = bcrypt.compareSync(password, user.password);
    if (!check) {
      return res.status(401).json({ message: "Invalid password" });
    }

    const access_token = jwt.sign(
      {
        userId: user._id,
      },
      process.env.SECRET,
      { expiresIn: "59m" }
    );

    const userToken = new tokenModel({
      userId: user._id,
      access_token,
    });
    await userToken.save();

    res.status(200).json(userToken);
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
};

exports.registerController = async (req, res) => {
  

  const { username, password, email, firstName, lastName } = req.body;
  const salt = 10;
  const hashpassword = await bcrypt.hash(password, salt);

  try {
    const user = new User({
      username,
      password: hashpassword,
      email,
      firstName,
      lastName,
    });

    await user.save();
    return res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
};

exports.deleteController = async (req, res) => {
  try {
    const user = await User.deleteOne({ _id: req.headers.access_token });
    res.status(204).json({ user });
  } catch (error) {
    console.error(error);
    res.status(400).send("Server Error");
  }
};

exports.getAllController = async (req, res) => {
  try {
    const user = await User.find();
    res.status(200).send(user);
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
};

exports.listController = async (req, res) => {
  const page = parseInt(req.params.page);
  const startIndex = page * 10 - 10;
  const endIndex = page * 10;
  try {
    const data = await User.find();
    const printUsers = data.slice(startIndex, endIndex);
    res.status(200).json({ users: printUsers });
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
};

exports.addressController = async (req, res) => {
  try {
    const user_id = req.userId;
    const { address, city, state, pin_code, phone_no } = req.body;
    const addressNew = new Address({
      user_id,
      address,
      city,
      state,
      pin_code,
      phone_no,
    });
     await addressNew.save();

    await User.findByIdAndUpdate(
     user_id,
     { $push: { addresses: addressNew._id } },
     { new: true, upsert: true }
    );

    res.status(200).json({ message: "Address saved", data: address });
  } catch (error) {
    console.error(error);
    res.status(400).send("Invalid Address");
  }
};

exports.addressListController = async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.params.id }).populate('addresses');

    if (!user) {
      return res.status(404).json({ message: "Address not found" });
    }

    res.status(200).json({ user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.deleteAddressController = async (req, res) => {
 try{
  const addressIds = req.body.addressIds;
  const user = req.userId;

  if (!addressIds || !Array.isArray(addressIds)) {
    return res.status(400).json({ error: "Invalid request format" });
  }

  await Address.deleteMany({ _id: { $in: addressIds } });

  await User.findByIdAndUpdate(
    user_id,
    { $pull: { addresses: addressIds } },
    { new: true, upsert: true }
   );

  res.json({ message: "Addresses deleted successfully" });
}catch(error){
  console.log(error);
  return res.status(500).json({message:"Server Error"})
}
};


