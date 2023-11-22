const {Sequelize}=require('sequelize');
let dbConfig={
    db_name:'firstdb',
    db_user:'root1',
    db_pass:'root1',
    dialect:"mysql",
    port:'9906',
    host:'localhost'
}

const sequelize=new Sequelize(dbConfig.db_name,dbConfig.db_user,dbConfig.db_pass,{
    host:dbConfig.host,
    dialect:dbConfig.dialect,
    port:dbConfig.port
})
try{
    sequelize.authenticate();
    console.log("Connected");
}catch(error){
    console.error("Unable to connect:",error)
}

module.exports=sequelize;
