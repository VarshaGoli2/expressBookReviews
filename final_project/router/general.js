const Axios = require("axios");
const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

// Register a new user
public_users.post("/register", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  if (username && password) {
    const present = users.find((user) => user.username === username);
    if (!present) {
      users.push({ username, password });
      return res.status(201).json({ message: "User created successfully" });
    } else {
      return res.status(400).json({ message: "User already exists" });
    }
  } else {
    return res.status(400).json({ message: "Username and password are required" });
  }
});

public_users.get('/', async (req, res) => {
  try {
    const response = await Axios.get('http://localhost:5000/books'); 
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: "An error occurred while fetching the book list." });
  }
});

public_users.get('/isbn/:isbn', async (req, res) => {
  const ISBN = req.params.isbn;
  try {
    const response = await Axios.get(`http://localhost:5000/books/${ISBN}`);
    res.json(response.data);
  } catch (error) {
    res.status(404).json({ error: "Book not found" });
  }
});

public_users.get('/author/:author', async (req, res) => {
  const author = req.params.author;
  try {
    const response = await Axios.get('http://localhost:5000/books');
    const filteredBooks = response.data.filter((b) => b.author === author);
    if (filteredBooks.length > 0) {
      res.json(filteredBooks);
    } else {
      res.status(404).json({ error: "No books found by this author" });
    }
  } catch (error) {
    res.status(500).json({ error: "An error occurred while fetching the book list." });
  }
});

public_users.get('/title/:title', async (req, res) => {
  const title = req.params.title;
  try {
    const response = await Axios.get('http://localhost:5000/books');
    const filteredBooks = response.data.filter((b) => b.title === title);
    if (filteredBooks.length > 0) {
      res.json(filteredBooks);
    } else {
      res.status(404).json({ error: "No books found with this title" });
    }
  } catch (error) {
    res.status(500).json({ error: "An error occurred while fetching the book list." });
  }
});

// Get book review based on ISBN
public_users.get('/review/:isbn', (req, res) => {
  const isbn = req.params.isbn;
  const book = Object.values(books).find((b) => b.isbn === isbn);
  if (book && book.reviews) {
    res.json(book.reviews);
  } else {
    res.status(404).json({ error: "Review not found" });
  }
});

module.exports.general = public_users;