const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username:String,
    password:String,
    email:String,
    firstname: String,
    lastname: String
  },{timestamps:true});

  module.exports= mongoose.model('User', userSchema);