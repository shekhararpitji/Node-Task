const express= require("express");
const User = require("../models/userRedg");

const router=express.Router();

 router.get("/",async(req,res,next)=>{
    const user=await User.findOne({"_id":req.headers.access_token})

    if(user){return next();}
    else{
        
        return res.send("Invalid");
    }

 },async(req,res)=>{
    const header = req.headers.access_token;

    console.log(header)
    const user=await User.findOne({"_id":header})
    res.send(user);
})
   

module.exports = router;