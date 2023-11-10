const express = require("express");
const userMid = require("../middlewares/userMid");
const userController = require("../controllers/userController");

const router = express.Router();

router.post("/register", userMid.redgMiddle, userController.registerCtrl);

router.post("/address", userMid.authMiddle, userController.addressCtrl);

router.post("/login", userMid.loginMiddle, userController.loginCtrl);

router.put("/delete", userMid.authMiddle, userController.deleteCtrl);

router.get("/get", userMid.authMiddle, userController.getAllCtrl);

router.get("/list/:page", userMid.authMiddle, userController.listController);

router.get("/get/:id",userMid.authMiddle,userController.addressListController);

module.exports = router;
