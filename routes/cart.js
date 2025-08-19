const express = require("express");
const router = express.Router();
const db = require("../db/connection");

// Get cart items for a user
router.get("/:userId", (req, res) => {
    const { userId } = req.params;
    db.query(
        `SELECT cart.id, books.title, books.author, books.price, cart.quantity 
         FROM cart 
         JOIN books ON cart.book_id = books.id 
         WHERE cart.user_id = ?`,
        [userId],
        (err, results) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json(results);
        }
    );
});

// Add book to cart
router.post("/", (req, res) => {
    const { userId, bookId, quantity } = req.body;
    db.query(
        "INSERT INTO cart (user_id, book_id, quantity) VALUES (?, ?, ?)",
        [userId, bookId, quantity || 1],
        (err, result) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ message: "Book added to cart", cartId: result.insertId });
        }
    );
});

// Remove item from cart
router.delete("/:id", (req, res) => {
    const { id } = req.params;
    db.query("DELETE FROM cart WHERE id = ?", [id], (err) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: "Item removed from cart" });
    });
});

module.exports = router;

