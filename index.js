const express = require("express");
require("./config/db");
require('dotenv').config();

const app = express();

app.use(express.json());

app.use('/user',require('./routes/userRoutes'));

app.listen(process.env.PORT, () => {
  console.log(`Server is running on http://localhost:${process.env.PORT}`);
});
