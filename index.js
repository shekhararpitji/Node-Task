const express = require("express");
require("./config/sqldb");
require('dotenv').config();
const passport = require('passport');
const session = require('express-session');
const User=require('./models/sqlModel');
const sqlToken = require("./models/sqlToken");
const app = express();

app.use(express.json());

app.use(passport.initialize());
// app.use(session({
//   secret: 'your-secret-key', // Change this to a random string
//   resave: false,
//   saveUninitialized: true
// }));
// app.use(passport.session());
// passport.serializeUser(function(user, done) {
//   done(null, user.id);
// });

// passport.deserializeUser(function(id, done) {
//   User.findById(id, function(err, user) {
//     done(err, user);
//   });
// });
app.use('/user',require('./routes/userRoutes'));
User.sync();
sqlToken.sync();
app.listen(process.env.PORT, () => {
  console.log(`Server is running on http://localhost:${process.env.PORT}`);
});
