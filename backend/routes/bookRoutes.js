import express from 'express';
import Book from '../models/book.js';
import User from '../models/user.js';
import jwt from 'jsonwebtoken';

const router = express.Router();

// Middleware for authentication
function auth(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ message: 'No token provided' });

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid token' });
  }
}

// GET /api/books — search books by title
router.get('/', async (req, res) => {
  try {
    const query = req.query.q?.trim();
    if (!query) return res.json([]); // Return empty array if no search term

    const books = await Book.find({ title: new RegExp(query, 'i') });
    res.json(books);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/books/:id — get book details
router.get('/:id', async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) return res.status(404).json({ message: 'Book not found' });
    res.json(book);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// POST /api/books/status — save book status for a user
router.post('/status', auth, async (req, res) => {
  try {
    const { bookId, status } = req.body;

    if (!bookId || !status) {
      return res.status(400).json({ message: 'Missing bookId or status' });
    }

    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Check if book already exists in user's bookshelf
    const existing = user.bookshelf.find(b => b.bookId.toString() === bookId);
    if (existing) {
      existing.status = status;
    } else {
      user.bookshelf.push({ bookId, status });
    }

    await user.save();
    res.json({ message: 'Book status updated successfully' });
  } catch (err) {
    console.error('Error saving status:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
