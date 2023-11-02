const { validationResult } = require("express-validator");
const User = require("../models/userModel");
const bcrypt = require("bcryptjs");
const tokenModel = require("../models/tokenModel");
const Address = require("../models/addressModel");

exports.loginCtrl = async (req, res) => {
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
    const check = bcrypt.compareSync(password, user.password);
    if (check) {
      console.log("password was true");
    } else {
      return res.status(400).json({ message: "Invalid credentials" });
    }
    const userId = req.body.user_id;
    const access_token = require("crypto")
      .createHash("md5")
      .update(Math.random().toString())
      .digest("hex");
    const expiry = new Date();
    expiry.setHours(expiry.getHours() + 1);

    const userToken = new tokenModel({
      userId,
      access_token,
      expiry,
    });
    await userToken.save();

    res.status(200).json({ userToken });
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
};

exports.registerCtrl = async (req, res) => {
  const errors = validationResult(req.body);
  if (!errors.isEmpty()) {
    console.log("error first");
    return res.status(400).json({ errors: errors.array() });
  }

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
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).send("Server Error");
  }
};

exports.deleteCtrl = async (req, res) => {
  try {
    console.log("first");
    const user = await User.deleteOne({ _id: req.headers.access_token });
    res.status(200).json({user});
  } catch (error) {
    console.error(error);
    res.status(400).send("Server Error");
  }
};

exports.getCtrl = async (req, res) => {
  try {
    const header = req.headers.access_token;

    const user = await User.findOne({ _id: header });
    res.status(200).send(user);
  } catch (error) {
    console.log(error);
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
    console.log(printUsers);
    res.status(200).json({ users: printUsers });
  } catch (error) {
    console.log(error);
    res.status(500).send("Server Error");
  }
};

exports.addressCtrl = async (req, res) => {
  try {
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
    res.status(200).send("Address saved", address);
  } catch (error) {
    console.log(error);
    res.status(400).send("Invalid Address");
  }
};

exports.addressListController = async (req, res) => {
  const userId = req.params.id;
  try {
    const address = await Address.findOne({ user_id: userId });

    if (!address) {
      return res.status(404).json({ message: "Address not found" });
    }

    res.status(200).json({ address });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};
