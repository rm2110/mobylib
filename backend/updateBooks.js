import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Book from './models/book.js';

dotenv.config();
await mongoose.connect(process.env.MONGO_URI);

const booksData = [
  { title: "The Hobbit", coverImage: "https://covers.openlibrary.org/b/id/6979861-L.jpg", rating: 4.7 },
  { title: "1984", coverImage: "https://covers.openlibrary.org/b/id/7222246-L.jpg", rating: 4.6 },
  { title: "To Kill a Mockingbird", coverImage: "https://covers.openlibrary.org/b/id/8228691-L.jpg", rating: 4.8 },
  { title: "The Catcher in the Rye", coverImage: "https://covers.openlibrary.org/b/id/8231856-L.jpg", rating: 3.9 },
  { title: "Pride and Prejudice", coverImage: "https://covers.openlibrary.org/b/id/8091016-L.jpg", rating: 4.5 },
  { title: "The Great Gatsby", coverImage: "https://covers.openlibrary.org/b/id/7222161-L.jpg", rating: 4.2 },
  { title: "Moby Dick", coverImage: "https://covers.openlibrary.org/b/id/7222276-L.jpg", rating: 3.7 },
  { title: "War and Peace", coverImage: "https://covers.openlibrary.org/b/id/8235083-L.jpg", rating: 4.4 },
  { title: "Crime and Punishment", coverImage: "https://covers.openlibrary.org/b/id/8235060-L.jpg", rating: 4.6 },
  { title: "The Lord of the Rings", coverImage: "https://covers.openlibrary.org/b/id/8306661-L.jpg", rating: 4.9 },
  { title: "Harry Potter and the Sorcerer's Stone", coverImage: "https://covers.openlibrary.org/b/id/7884861-L.jpg", rating: 4.8 },
  { title: "Harry Potter and the Chamber of Secrets", coverImage: "https://covers.openlibrary.org/b/id/7884862-L.jpg", rating: 4.7 },
  { title: "Harry Potter and the Prisoner of Azkaban", coverImage: "https://covers.openlibrary.org/b/id/7884863-L.jpg", rating: 4.9 },
  { title: "Harry Potter and the Goblet of Fire", coverImage: "https://covers.openlibrary.org/b/id/7884864-L.jpg", rating: 4.8 },
  { title: "Harry Potter and the Order of the Phoenix", coverImage: "https://covers.openlibrary.org/b/id/7884865-L.jpg", rating: 4.7 },
  { title: "Harry Potter and the Half-Blood Prince", coverImage: "https://covers.openlibrary.org/b/id/7884866-L.jpg", rating: 4.8 },
  { title: "Harry Potter and the Deathly Hallows", coverImage: "https://covers.openlibrary.org/b/id/7884867-L.jpg", rating: 4.9 },
  { title: "The Alchemist", coverImage: "https://covers.openlibrary.org/b/id/8231991-L.jpg", rating: 4.3 },
  { title: "The Da Vinci Code", coverImage: "https://covers.openlibrary.org/b/id/240726-L.jpg", rating: 4.2 },
  { title: "Angels & Demons", coverImage: "https://covers.openlibrary.org/b/id/240727-L.jpg", rating: 4.1 },
  { title: "Inferno", coverImage: "https://covers.openlibrary.org/b/id/8164713-L.jpg", rating: 4.0 },
  { title: "The Girl with the Dragon Tattoo", coverImage: "https://covers.openlibrary.org/b/id/8234877-L.jpg", rating: 4.3 },
  { title: "The Girl Who Played with Fire", coverImage: "https://covers.openlibrary.org/b/id/8234878-L.jpg", rating: 4.2 },
  { title: "The Girl Who Kicked the Hornet's Nest", coverImage: "https://covers.openlibrary.org/b/id/8234879-L.jpg", rating: 4.3 },
  { title: "A Game of Thrones", coverImage: "https://covers.openlibrary.org/b/id/8101351-L.jpg", rating: 4.7 },
  { title: "A Clash of Kings", coverImage: "https://covers.openlibrary.org/b/id/8101352-L.jpg", rating: 4.6 },
  { title: "A Storm of Swords", coverImage: "https://covers.openlibrary.org/b/id/8101353-L.jpg", rating: 4.8 },
  { title: "A Feast for Crows", coverImage: "https://covers.openlibrary.org/b/id/8101354-L.jpg", rating: 4.3 },
  { title: "A Dance with Dragons", coverImage: "https://covers.openlibrary.org/b/id/8101355-L.jpg", rating: 4.4 },
  { title: "Brave New World", coverImage: "https://covers.openlibrary.org/b/id/8225630-L.jpg", rating: 4.1 },
  { title: "The Kite Runner", coverImage: "https://covers.openlibrary.org/b/id/8228701-L.jpg", rating: 4.5 },
  { title: "One Hundred Years of Solitude", coverImage: "https://covers.openlibrary.org/b/id/8225590-L.jpg", rating: 4.6 },
  { title: "The Book Thief", coverImage: "https://covers.openlibrary.org/b/id/8225585-L.jpg", rating: 4.7 },
  { title: "The Hunger Games", coverImage: "https://covers.openlibrary.org/b/id/8102163-L.jpg", rating: 4.6 },
  { title: "Catching Fire", coverImage: "https://covers.openlibrary.org/b/id/8102164-L.jpg", rating: 4.5 },
  { title: "Mockingjay", coverImage: "https://covers.openlibrary.org/b/id/8102165-L.jpg", rating: 4.3 },
  { title: "Dune", coverImage: "https://covers.openlibrary.org/b/id/8101347-L.jpg", rating: 4.6 },
  { title: "The Shining", coverImage: "https://covers.openlibrary.org/b/id/8228700-L.jpg", rating: 4.4 },
  { title: "It", coverImage: "https://covers.openlibrary.org/b/id/8228699-L.jpg", rating: 4.5 },
  { title: "Misery", coverImage: "https://covers.openlibrary.org/b/id/8228698-L.jpg", rating: 4.2 },
  { title: "Carrie", coverImage: "https://covers.openlibrary.org/b/id/8228697-L.jpg", rating: 4.0 },
  { title: "The Stand", coverImage: "https://covers.openlibrary.org/b/id/8228696-L.jpg", rating: 4.6 },
  { title: "Dracula", coverImage: "https://covers.openlibrary.org/b/id/8091234-L.jpg", rating: 4.4 },
  { title: "Frankenstein", coverImage: "https://covers.openlibrary.org/b/id/8091235-L.jpg", rating: 4.2 },
  { title: "The Picture of Dorian Gray", coverImage: "https://covers.openlibrary.org/b/id/8091236-L.jpg", rating: 4.3 },
  { title: "The Odyssey", coverImage: "https://covers.openlibrary.org/b/id/8228702-L.jpg", rating: 4.1 },
  { title: "The Iliad", coverImage: "https://covers.openlibrary.org/b/id/8228703-L.jpg", rating: 4.2 },
  { title: "Les Misérables", coverImage: "https://covers.openlibrary.org/b/id/8228704-L.jpg", rating: 4.6 },
  { title: "Don Quixote", coverImage: "https://covers.openlibrary.org/b/id/8228705-L.jpg", rating: 4.3 },
  { title: "The Divine Comedy", coverImage: "https://covers.openlibrary.org/b/id/8228706-L.jpg", rating: 4.5 }
];

for (const b of booksData) {
  await Book.findOneAndUpdate(
    { title: b.title },
    { $set: { coverImage: b.coverImage, rating: b.rating } },
    { new: true }
  );
  console.log(`Updated ${b.title}`);
}

mongoose.connection.close();
console.log('All book covers and ratings updated!');
