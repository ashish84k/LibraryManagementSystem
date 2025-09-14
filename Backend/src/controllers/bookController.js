const Book = require("../models/Book");
const Borrow = require("../models/Borrow");

// Get all books
exports.getBooks = async (req, res) => {
  try {
    const books = await Book.findAll({
      order: [['createdAt', 'DESC']]
    });
    res.json(books);
  } catch (err) {
    res.status(500).json({ message: "Error fetching books" });
  }
};

// Add new book
exports.createBook = async (req, res) => {
  try {
    const { title, author, genre, totalCopies } = req.body;
    if (!title || !author || !genre || !totalCopies) {
      return res.status(400).json({ message: "All fields are required" });
    }
    const book = await Book.create({ title, author, genre, totalCopies });
    res.status(201).json({ id: book.id, message: "Book added successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error adding book" });
  }
};

// Update book
exports.updateBook = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, author, genre, totalCopies } = req.body;
    
    const book = await Book.findByPk(id);
    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }
    
    await book.update({ title, author, genre, totalCopies });
    res.json({ message: "Book updated successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error updating book" });
  }
};

// Delete book
exports.deleteBook = async (req, res) => {
  try {
    const { id } = req.params;
    
    const book = await Book.findByPk(id);
    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }
    
    await book.destroy();
    res.json({ message: "Book deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting book" });
  }
};
