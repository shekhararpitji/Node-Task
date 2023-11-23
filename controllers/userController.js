const { validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");
// const User = require("../models/userModel");
 const User = require("../models/sqlModel");
const bcrypt = require("bcryptjs");
// const tokenModel = require("../models/tokenModel");
const sqlToken=require('../models/sqlToken');
// const Address = require("../models/addressModel");
const Address = require("../models/sqlAddress");
// const UserToken = require("../models/sqlToken");

exports.loginCtrl = async (req, res) => {
  // const errors = validationResult(req);

  // if (!errors.isEmpty()) {
  //   return res.status(400).json({ errors: errors.array() });
  // }
  const { username } = req.body;

  try {
   const user=await User.findOne({
      where: {
        username,
      },
    })
    if (!user) {
      return res.status(401).json({ message: "username not found" });
    }

    const access_token = jwt.sign(
      {
        userId: user.id,
      },
      process.env.SECRET,
      { expiresIn: "59m" }
    );
    

    const userToken =await sqlToken.create({
     
     userId:user.id,
     access_token
      
    });

    res.status(200).json(userToken);
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
};

exports.registerCtrl = async (req, res) => {
  const errors = validationResult(req.body);
  if (!errors.isEmpty()) {
    console.error("error in validation");
    return res.status(400).json({ errors: errors.array() });
  }

  const { username, password, email, firstName, lastName } = req.body;
  const salt = 10;
  const hashpassword = await bcrypt.hash(password, salt);

  try {
    await User.create({
      username,
      password,
      email,
      firstName,
      lastName,
    });
   
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
};

exports.deleteCtrl = async (req, res) => {
  try {
    const access_token=req.headers.access_token;
    const user = await User.destroy({where:{ id:access_token }});

    res.status(200).json({ user });
  } catch (error) {
    console.error(error);
    res.status(400).send("Server Error");
  }
};

exports.getAllCtrl = async (req, res) => {
  try {
    const user = await User.findAll();
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
    const status = await User.aggregate([
      {
        $match: { firstname: "mike" },
      },
      {
        $group: {
          _id: null,
          firstname: { $count: {} },
        },
      },
    ]);
    console.log(status);
    const data = await User.find();
    const printUsers = data.slice(startIndex, endIndex);
    res.status(200).json({ users: printUsers });
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
};

exports.addressCtrl = async (req, res) => {
  try {
    const access_token = req.get("authorization").split(" ")[1];
    const userToken = await sqlToken.findOne({ where: { access_token: access_token } });
    const { address, city, state, pin_code, phone_no } = req.body;
    const addressNew =await Address.create({
      user_id: userToken.id,
      address,
      city,
      state,
      pin_code,
      phone_no,
    });



    res.status(200).json({ message: "Address saved", data: address });
  } catch (error) {
    console.error(error);
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

exports.deleteAddressCtrl = async (req, res) => {
  try {
    const addressIds = req.body.addressIds;
    const user = req.userId;

    if (!addressIds || !Array.isArray(addressIds)) {
      return res.status(400).json({ error: "Invalid request format" });
    }

    await Address.deleteMany({ _id: { $in: addressIds } });

    res.json({ message: "Addresses deleted successfully" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Server Error" });
  }
};
