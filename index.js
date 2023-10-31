const express = require("express");
const { userLogin, userRegister, userGet, loginUrl, registerUrl, getUrl, userDelete, deleteUrl } = require("./constants");
require("./config/db");

const app = express();

app.use(express.json());

app.use('/user',require('./routes/userRoutes'))
// app.use(userLogin, require(loginUrl));

// app.use(userRegister, require(registerUrl));

// app.use(userGet, require(getUrl))

// app.use(userDelete, require(deleteUrl))

app.listen(5600, () => {
  console.log("Server is running on http://localhost:5600");
});
