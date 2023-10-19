const dbConnect=require("./dbConnect")
const crypto = require('crypto');

const usersData =require ('./usersData');

function encryptPassword(password) {
 const hash = crypto.createHash('md5'); 
hash.update(password); 
const hashedPassword = hash.digest('hex'); 

return hashedPassword;
}

async function insertUsers() {
let dbCon=await dbConnect();
   const usersCol =await dbCon.collection("Users");
   const userProfileCol =await dbCon.collection("UsersProfile");

   for (const userData of usersData) {
     userData.password = encryptPassword(userData.password);

     const userResult = await usersCol.insertOne(userData)

     const userProfileData = {
       user_id: userResult.insertedId,
       dob: null,
       Mobile_no: null 
     };

     await userProfileCol.insertOne(userProfileData);

     console.log(`User ID: ${userResult.insertedId}`);
   }
 } 
 
insertUsers();
