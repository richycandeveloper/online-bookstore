const { DataTypes } = require("sequelize");
const sequelize = require("../db");

const Book = sequelize.define("Book", {
  title: { type: DataTypes.STRING, allowNull: false },
  author: { type: DataTypes.STRING, allowNull: false },
  price: { type: DataTypes.FLOAT, allowNull: false },
  image: { type: DataTypes.STRING }
});

module.exports = practice;
