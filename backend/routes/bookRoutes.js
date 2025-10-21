import express from 'express';
import Book from '../models/book.js';
import User from '../models/user.js';
import jwt from 'jsonwebtoken';

const router = express.Router();

// Auth middleware
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
    if (!query) return res.json([]);
    const books = await Book.find({ title: new RegExp(query, 'i') });
    res.json(books);
  } catch (err) {
    console.error('Search error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/books/bookshelf — fetch user’s bookshelf
router.get('/bookshelf', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate('bookshelf.bookId');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({ bookshelf: user.bookshelf });
  } catch (err) {
    console.error('Bookshelf fetch error:', err);
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
    console.error('Book fetch error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// POST /api/books/status — add/update a book’s status
router.post('/status', auth, async (req, res) => {
  try {
    const { bookId, status } = req.body;
    if (!bookId || !status) {
      return res.status(400).json({ message: 'Missing bookId or status' });
    }

    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const existingEntry = user.bookshelf.find(entry => entry.bookId.toString() === bookId);
    if (existingEntry) {
      existingEntry.status = status;
    } else {
      user.bookshelf.push({ bookId, status });
    }

    await user.save();
    res.json({ message: 'Book added to your bookshelf!' });
  } catch (err) {
    console.error('Error saving book status:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// PATCH /api/books/bookshelf/:bookId — update status of a book in bookshelf
router.patch('/bookshelf/:bookId', auth, async (req, res) => {
  try {
    const { bookId } = req.params;
    const { status } = req.body;
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const bookEntry = user.bookshelf.find(entry => entry.bookId.toString() === bookId);
    if (!bookEntry) return res.status(404).json({ message: 'Book not found in bookshelf' });

    bookEntry.status = status;

    if (status !== 'read') {
      bookEntry.favorite = false;
    }

    await user.save();
    res.json({ message: 'Book status updated successfully', status: bookEntry.status, favorite: bookEntry.favorite });
  } catch (err) {
    console.error('Error updating book status:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// DELETE /api/books/bookshelf/:bookId — delete book from bookshelf
router.delete('/bookshelf/:bookId', auth, async (req, res) => {
  try {
    const { bookId } = req.params;
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.bookshelf = user.bookshelf.filter(entry => entry.bookId.toString() !== bookId);
    await user.save();

    res.json({ message: 'Book removed successfully' });
  } catch (err) {
    console.error('Error deleting book:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Mark or unmark a book as favorite
router.patch("/bookshelf/:bookId/favorite", auth, async (req, res) => {
  try {
    const { bookId } = req.params;
    const { favorite } = req.body;

    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    const bookEntry = user.bookshelf.find(entry => entry.bookId.toString() === bookId);
    if (!bookEntry) return res.status(404).json({ message: "Book not found in bookshelf" });

    if (favorite && bookEntry.status !== 'read') {
      return res.status(400).json({ message: 'Only "read" books can be marked as favorite' });
    }

    bookEntry.favorite = favorite;
    await user.save();

    res.json({ message: "Favorite status updated successfully", favorite: bookEntry.favorite });
  } catch (err) {
    console.error("Error updating favorite:", err);
    res.status(500).json({ message: "Server error" });
  }
});


export default router;
