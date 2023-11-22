const express = require("express");
const jwtVerify = require("../middlewares/jwtVerify")
const userController = require("../controllers/userController");
const LocalStrategy = require('passport-local').Strategy;
const passMiddle = require('../middlewares/passportMid');
const passport = require('passport');


const router = express.Router();

// passport.use(new LocalStrategy(passMiddle.passMid
   
//   ));


router.post("/address", jwtVerify.authMiddle, userController.addressCtrl);


router.put("/delete", jwtVerify.authMiddle, userController.deleteCtrl);

router.delete("/user/address", jwtVerify.authMiddle, userController.deleteAddressCtrl);

router.get("/get", jwtVerify.authMiddle, userController.getAllCtrl);

router.get("/list/:page",
// jwtVerify.authMiddle,
 userController.listController);

router.get("/get/:id",jwtVerify.authMiddle,userController.addressListController);

router.post('/login', 
// passport.authenticate('local'),
userController.loginCtrl);

router.post('/register',
//  passport.authenticate('local'),
 userController.registerCtrl);

module.exports = router;
