const express=require('express')
const router=express.Router();

router.put('/',async(req,res)=>{
    try{console.log("first")
    let user=await User.deleteOne({"_id":req.headers.access_token})
    res.send(user)
    }catch(error){
        console.error(error);
        res.status(400).send("Server Error")
    }
})