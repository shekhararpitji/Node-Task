const mongoose = require("mongoose");
require('dotenv').config();
const db=async()=>{
    try{
        await mongoose.connect(process.env.dburl);
     }catch(error){
         console.log(error);
         res.status(500).send("Database connection error");
     }
}
db();
