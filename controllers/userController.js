const { validationResult } = require("express-validator");
const User = require("../models/userModel");
const bcrypt=require('bcryptjs');   
const { start } = require("repl");


exports.loginCtrl=async (req, res) => {
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

  exports.registerCtrl= async (req, res) => {
      const errors = validationResult(req.body);
      if (!errors.isEmpty()) {
          console.log("error first")
          return res.status(400).json({ errors: errors.array() });
        }
        
        const { username, password, email, firstName, lastName } = req.body;
        const salt = 10;
        let hashpassword = await bcrypt.hash(password,salt);
        
        console.log(req.body)
    try {
      const user = new User({
        username,
        password: hashpassword,
        email,
        firstName,
        lastName,
      });

      await user.save();
      res.json({ message: "User registered successfully" });
    } catch (error) {
      console.log(error);
      res.status(500).send("Server Error");
    }
  }

  exports.deleteCtrl=async(req,res)=>{
    try{console.log("first")
    let user=await User.deleteOne({"_id":req.headers.access_token})
    res.send(user)
    }catch(error){
        console.error(error);
        res.status(400).send("Server Error")
    }
}

exports.getCtrl=async(req,res)=>{
    const header = req.headers.access_token;

    console.log(header)
    const user=await User.findOne({"_id":header})
    res.send(user);
}

exports.listController =async (req, res) => {
    let page = parseInt(req.params.page);
    let startIndex = page * 10 - 10;
    let endIndex = page * 10;
    try {
      let data = await User.find();
      let printUsers = data.slice(startIndex, endIndex);
      console.log(printUsers)
      res.json({ users: printUsers });
    } catch (error) {
      console.log(error);
      res.status(500).send("Server Error");
    }
  }
