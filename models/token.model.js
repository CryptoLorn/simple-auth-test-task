const {DataTypes} = require('sequelize');

const sequelize = require('../db');

const Token = sequelize.define('token', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    token: {type: DataTypes.STRING, allowNull: false}
});

module.exports = {Token};