const express = require("express");
const jwtVerify = require("../middlewares/jwtVerify")
const userController = require("../controllers/userController");
const authController = require('../controllers/authController')
const {redgMiddle}=require('../middlewares/validationMid')
const {upload} = require('../config/multerConfiguration');
const passport = require('passport');



const router = express.Router();




router.post("/address", jwtVerify.authMiddle, userController.addressController);

router.put("/delete", jwtVerify.authMiddle, userController.deleteController);

router.delete("/address", jwtVerify.authMiddle, userController.deleteAddressController);

router.get("/get", jwtVerify.authMiddle, userController.getAllController);

router.get("/list/:page", jwtVerify.authMiddle, userController.listController);

router.get("/get/:id",jwtVerify.authMiddle,userController.addressListController);

router.post('/login', passport.authenticate('local'),userController.loginController);

router.post('/register', redgMiddle,userController.registerController);

router.post("/forgot-password", authController.forgetPassController);

router.put("/verify-reset-password/:resetToken",authController.resetPassword);

router.put("/profile-image",upload.single("avatar"),authController.profileImageController);

module.exports = router;
