const { DataTypes } = require('sequelize');
const sequelize = require('../config/sqldb');
const Address = require('./sqlAddress');

 const User = sequelize.define('User', {
  username:{
    type: DataTypes.STRING,
  },
  password:{
    type: DataTypes.STRING,
  },
  email:{
    type: DataTypes.STRING,
  },
  firstName: {
    type: DataTypes.STRING,
  },
  lastName: {
    type: DataTypes.STRING
  }
}, {
    tableName: 'user',
    timestamps: true
});
  
User.hasMany(Address);
Address.belongsTo(User);



console.log(User === sequelize.models.User); // true
module.exports=User;