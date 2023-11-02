const mongoose = require("mongoose");
require('dotenv').config();
try{
    mongoose.connect(process.env.dburl);
}catch(error){
    console.log(error);
    res.status(500).send("Database connection error");
}
