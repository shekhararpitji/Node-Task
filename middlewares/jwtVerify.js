const UserToken = require("../models/tokenModel");
const jwt = require("jsonwebtoken");

exports.authMiddle = async (req, res, next) => {
  try {
    const access_token = req.get("authorization").split(" ")[1];
    const userToken = await UserToken.findOne({ access_token: access_token });
    if (!userToken) {
      return res.status(404).send("access_token not found");
    }
    const decoded = jwt.verify(access_token, process.env.SECRET);
    if (decoded.userId) {
      req.userId = decoded.userId;
      next();
    } else {
      res.status(401).json({ message: "Unauthorized" });
    }
  } catch (error) {
    res.status(500).send("Server Error");
  }
};
