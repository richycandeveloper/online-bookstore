const { Sequelize } = require("sequelize");

// Update with your own MySQL settings
const sequelize = new Sequelize("bookstore_db", "root", "your_password", {
  host: "localhost",
  dialect: "mysql",
  logging: false,
});

sequelize.authenticate()
  .then(() => console.log("✅ MySQL connected"))
  .catch(err => console.error("❌ MySQL error:", err));

module.exports = sequelize;
