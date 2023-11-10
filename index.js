const express = require("express");
require("./config/db");
require('dotenv').config();
const passport = require('passport');
const session = require('express-session');
const {initializingPassport}=require('./config/passportConfig')

const app = express();

app.use(express.json());
initializingPassport(passport);
app.use(passport.initialize());
app.use(session({
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: true
}));

app.use('/user',require('./routes/userRoutes'));

app.listen(process.env.PORT, () => {
  console.log(`Server is running on http://localhost:${process.env.PORT}`);
});
