const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
require("dotenv").config();

const sequelize = require("./db");
const User = require("./models/account");
const Book = require("./models/practice");

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(express.static("public"));

// Routes
const authRoutes = require("./routes/auth");
const bookRoutes = require("./routes/books");

app.use("/api/auth", authRoutes);
app.use("/api/books", bookRoutes);

// Sync DB
sequelize.sync().then(() => {
  console.log("✅ Database synced");
});

const PORT = 5000;
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
