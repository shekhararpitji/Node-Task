const dbConnect = require("./dbConnect");
const crypto = require("crypto");
const express = require("express");
const app = express();

const usersData = require("./usersData");
let usersProfileData = require("./usersProfileData");

function encryptPassword(password) {
  const hash = crypto.createHash("md5");
  hash.update(password);
  const hashedPassword = hash.digest("hex");

  return hashedPassword;
}

async function insertUsers() {
  let dbCon = await dbConnect();
  const usersCol = await dbCon.collection("Users");
  const userProfileCol = await dbCon.collection("UsersProfile");
  let i = 0;
  for (const userData of usersData) {
    userData.password = encryptPassword(userData.password);

    const userResult = await usersCol.insertOne(userData);

    let userProfileData = {
      user_id: userResult.insertedId,
      dob: usersProfileData[i].dob,

      Mobile_No: Math.floor(Math.random() * 10000000000),
    };
    i++;

    await userProfileCol.insertOne(userProfileData);
  }
}

insertUsers();
function getAge(dateString) {
  var today = new Date();
  var birthDate = new Date(dateString);
  var age = today.getFullYear() - birthDate.getFullYear();
  var m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
}

app.get("/users", async (req, res) => {
  let data = await dbConnect();
  let result1 = await data.collection("Users").find().toArray();

  res.send(result1);
});
app.get("/usersProfile", async (req, res) => {
  let data = await dbConnect();

  let result2 = await data.collection("UsersProfile").find().toArray();

  res.send(result2);
});

app.get("/avgAge", async (req, res) => {
  let data = await dbConnect();

  let result2 = await data.collection("UsersProfile").find().toArray();
  let sum = 0;
  let avg = 0;
  for (const i of result2) {
    let b = getAge(i.dob);
    sum = sum + b;
  }
  avg = sum / result2.length;
  res.send({ avg: avg });
});

app.get("/delete", async (req, res) => {
  let dbCon = await dbConnect();
  let data = await dbConnect();
  const usersCol = await dbCon.collection("Users");
  const userProfileCol = await dbCon.collection("UsersProfile");

  let result2 = await data.collection("UsersProfile").find().toArray();
  for (const i of result2) {
    let b = getAge(i.dob);
    if (b > 25) {
      await userProfileCol.deleteOne({ dob: i.dob });
      await usersCol.deleteOne({ _id: i.user_id });
    }
  }
});

app.listen(5500, (req, res) => {
  console.log("server is created");
});
