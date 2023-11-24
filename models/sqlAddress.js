const { DataTypes } = require('sequelize');
const sequelize = require('../config/sqldb');
// const User = require('./sqlModel');

 const Address = sequelize.define('Address', {
  address:{
    type: DataTypes.STRING,
  },
  city:{
    type: DataTypes.STRING,
  },
  state:{
    type: DataTypes.STRING,
  },
  pin_code: {
    type: DataTypes.INTEGER,
  },
  phone_no: {
    type: DataTypes.STRING
  }
}, {
    tableName: 'address',
    timestamps: true
});



console.log(Address === sequelize.models.Address); // true
module.exports=Address;