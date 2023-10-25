const bcrypt = require("bcryptjs");
const express = require("express");
const bodyParser = require('body-parser');
const User=require('../src/models/user.model');
require("./config")
   

const app = express();

app.use(express.json());
let workFactor=8;
let hashedPass;



app.get('/user/register', async (req, res) => {
  res.send("hello")
 
})  

  app.post('/user/register', async (req, res) => {
    const { username, password, confirmPassword, email, firstname, lastname } = req.body;

    const isUserPresent=await User.findOne({"username":username});
    const isUserPresen=await User.findOne({"email":email});



    if(isUserPresent!==null||isUserPresen!==null){
      res.send("user already present")
    }
    else if(password!==confirmPassword){
      console.log("password not matched")
    }else {
      bcrypt
  .genSalt(workFactor)
  .then(salt => {
    console.log(`Salt: ${salt}`);
    hashedPass= bcrypt.hash(password, salt);
  })
  .then(hash => {
    console.log(`Hash: ${hash}`);
  })
  .catch(err => console.error(err.message));

      let data=new User({
        username,
        email,
        firstname,
        lastname,
        password:hashedPass
      });
      let result=await data.save();
      res.send("Done");
    }

  })  
  

  app.listen(5600, () => {
    console.log('Server is running on http://localhost:5600');
  });