import mongoose from 'mongoose';

const bookSchema = new mongoose.Schema({
  title: { type: String, required: true },
  author: { type: String, required: true },
  description: { type: String },
  coverImage: { type: String }, // URL of cover image
  rating: { type: Number, default: 0 } // average rating
});

// Prevent OverwriteModelError
const Book = mongoose.models.Book || mongoose.model('Book', bookSchema);

export default Book;
