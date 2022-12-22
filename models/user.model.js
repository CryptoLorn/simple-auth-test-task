const {DataTypes} = require('sequelize');

const sequelize = require('../db');

const User = sequelize.define('user', {
    id: {type: DataTypes.STRING, primaryKey: true, unique: true, allowNull: false},
    password: {type: DataTypes.STRING, allowNull: false},
    id_type: {type: DataTypes.STRING}
});

module.exports = {User};