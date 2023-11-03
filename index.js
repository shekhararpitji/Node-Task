const express = require("express");
require("./config/db");
require('dotenv').config();
const passport = require('passport');
const session = require('express-session');

const app = express();

app.use(express.json());

app.use(passport.initialize());
app.use(session({
  secret: 'your-secret-key', // Change this to a random string
  resave: false,
  saveUninitialized: true
}));
app.use(passport.session());
passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});
app.use('/user',require('./routes/userRoutes'));

app.listen(process.env.PORT, () => {
  console.log(`Server is running on http://localhost:${process.env.PORT}`);
});
