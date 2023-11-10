const  User  = require("../models/userModel");
const bcrypt=require('bcryptjs')
const LocalStrategy = require("passport-local");
exports.initializingPassport = (passport) => {
  passport.use(
    new LocalStrategy(async (username, password, done) => {
      try {
        console.log(username,password);
        
        const user = await User.findOne({username});
        if (!user) return done(null, false);
        const check=await bcrypt.compare(password,user.password);
          if (check) {
            return done(null, user);
        }
        
      } catch (error) {
        return done(error, false);
      }
    })
  );
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });
  passport.deserializeUser(async (id, done) => {
    try {
      const user = await User.findById(id);
      done(null, user);
    } catch (error) {
      done(error, false);
    }
  });
};

exports.isAuthenticated = (req, res, next) => {
  if (req.user) next();
  res.redirect("/login");
};
