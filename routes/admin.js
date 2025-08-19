const express = require("express");
const router = express.Router();
const db = require("../db/connection");

// Add a new book
router.post("/add", (req, res) => {
    const { title, author, price, description, image_url } = req.body;
    db.query(
        "INSERT INTO books (title, author, price, description, image_url) VALUES (?, ?, ?, ?, ?)",
        [title, author, price, description, image_url],
        (err, result) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ message: "Book added successfully", bookId: result.insertId });
        }
    );
});

// Delete a book
router.delete("/:id", (req, res) => {
    const { id } = req.params;
    db.query("DELETE FROM books WHERE id = ?", [id], (err) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: "Book deleted successfully" });
    });
});

module.exports = router;

