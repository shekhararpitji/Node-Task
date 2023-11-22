const { DataTypes } = require('sequelize');
const sequelize = require('../config/sqldb')

 const sqlToken = sequelize.define('Token', {
  userId:{
    type: DataTypes.STRING,
  },
  access_token:{
    type: DataTypes.STRING,
  }
}, {
    tableName: 'token',
    timestamps: true
});




console.log(sqlToken === sequelize.models.Token); // true
module.exports=sqlToken;