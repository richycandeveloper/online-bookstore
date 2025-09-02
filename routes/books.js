const express = require("express");
const router = express.Router();
const Book = require("../models/Book");

// Get all books
router.get("/", async (req, res) => {
  const books = await Book.findAll();
  res.json(books);
});

// Add a book (admin only later)
router.post("/add", async (req, res) => {
  const { title, author, price, image } = req.body;
  try {
    const book = await Book.create({ title, author, price, image });
    res.json({ message: "Book added successfully", book });
  } catch (err) {
    res.status(400).json({ error: "Error adding book" });
  }
});

module.exports = router;
