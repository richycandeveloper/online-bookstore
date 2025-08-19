import express from "express";
import mysql from "mysql2";
import bodyParser from "body-parser";
import path from "path";
import { fileURLToPath } from "url";

// Fix for __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "public"))); // serve frontend

// Database connection
const db = mysql.createConnection({
  host: "localhost",
  user: "root",       // your MySQL username
  password: "",       // your MySQL password
  database: "online_bookstore"
});

// Connect DB
db.connect((err) => {
  if (err) {
    console.error("Database connection failed:", err);
    return;
  }
  console.log("✅ Connected to MySQL database");
});

// Test route
app.get("/api/books", (req, res) => {
  db.query("SELECT * FROM books", (err, results) => {
    if (err) {
      res.status(500).send("Error fetching books");
      return;
    }
    res.json(results);
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
