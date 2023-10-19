const { MongoClient } = require('mongodb')
const url='mongodb://localhost:27017';
const dbName= "mydatabase"
const client = new MongoClient(url);


async function dbConnect(){
    let result =await client.connect();
    db=result.db(dbName);
    return db
} 
module.exports=dbConnect;