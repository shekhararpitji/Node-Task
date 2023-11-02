const express= require("express");
const userMid =require('../middlewares/userMid')
const userController = require("../controllers/userController");

const router=express.Router();

router.post("/register",userMid.redgMiddle,userController.registerCtrl);

router.post("/login",userMid.loginMiddle, userController.loginCtrl);

router.put('/delete',userController.deleteCtrl);

router.get("/get",userMid.getMidlle,userController.getCtrl)

router.get("/list/:page", userController.listController);


module.exports = router;