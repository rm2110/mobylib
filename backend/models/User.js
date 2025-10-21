import mongoose from 'mongoose';

const bookshelfSchema = new mongoose.Schema({
  bookId: { type: mongoose.Schema.Types.ObjectId, ref: 'Book', required: true },
  status: {
    type: String,
    enum: ['want-to-read', 'currently-reading', 'read'],
    required: true
  },
  favorite: { type: Boolean, default: false } 
});

const userSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  bookshelf: [bookshelfSchema]
});

const User = mongoose.models.User || mongoose.model('User', userSchema);
export default User;
