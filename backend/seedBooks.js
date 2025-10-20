// seedBooks.js
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Book from './models/book.js';

dotenv.config();

const books = [
  // Fiction
  { title: 'To Kill a Mockingbird', author: 'Harper Lee', genre: 'Fiction', description: 'A timeless classic about justice and racism.', coverImage: 'https://m.media-amazon.com/images/I/81OxWqZtA-L.jpg', rating: 4.8 },
  { title: '1984', author: 'George Orwell', genre: 'Dystopian', description: 'A chilling novel about totalitarianism and surveillance.', coverImage: 'https://m.media-amazon.com/images/I/71kxa1-0mfL.jpg', rating: 4.7 },
  { title: 'The Great Gatsby', author: 'F. Scott Fitzgerald', genre: 'Fiction', description: 'The Jazz Age novel of love, wealth, and tragedy.', coverImage: 'https://m.media-amazon.com/images/I/81af+MCATTL.jpg', rating: 4.5 },
  { title: 'Pride and Prejudice', author: 'Jane Austen', genre: 'Romance', description: 'A witty and romantic story of manners and marriage.', coverImage: 'https://m.media-amazon.com/images/I/81A-mvlo+QL.jpg', rating: 4.6 },
  { title: 'The Catcher in the Rye', author: 'J.D. Salinger', genre: 'Fiction', description: 'A rebellious teen’s cynical journey through New York.', coverImage: 'https://m.media-amazon.com/images/I/81OthjkJBuL.jpg', rating: 4.1 },
  { title: 'Moby-Dick', author: 'Herman Melville', genre: 'Adventure', description: 'A sea captain’s obsessive quest for a legendary whale.', coverImage: 'https://m.media-amazon.com/images/I/81PRVJPbAPL.jpg', rating: 4.0 },
  { title: 'The Hobbit', author: 'J.R.R. Tolkien', genre: 'Fantasy', description: 'A hobbit’s adventure to reclaim a stolen treasure.', coverImage: 'https://m.media-amazon.com/images/I/91b0C2YNSrL.jpg', rating: 4.9 },
  { title: 'The Lord of the Rings', author: 'J.R.R. Tolkien', genre: 'Fantasy', description: 'The epic journey to destroy the One Ring.', coverImage: 'https://m.media-amazon.com/images/I/91SZSW8qSsL.jpg', rating: 4.9 },
  { title: 'The Alchemist', author: 'Paulo Coelho', genre: 'Philosophical', description: 'A journey of self-discovery and destiny.', coverImage: 'https://m.media-amazon.com/images/I/71aFt4+OTOL.jpg', rating: 4.6 },
  { title: 'Crime and Punishment', author: 'Fyodor Dostoevsky', genre: 'Classic', description: 'A psychological exploration of guilt and redemption.', coverImage: 'https://m.media-amazon.com/images/I/81a4kCNuH+L.jpg', rating: 4.5 },

  // Non-fiction
  { title: 'Sapiens', author: 'Yuval Noah Harari', genre: 'History', description: 'A brief history of humankind.', coverImage: 'https://m.media-amazon.com/images/I/713jIoMO3UL.jpg', rating: 4.8 },
  { title: 'Educated', author: 'Tara Westover', genre: 'Memoir', description: 'A woman’s quest for education and self-liberation.', coverImage: 'https://m.media-amazon.com/images/I/81WojUxbbFL.jpg', rating: 4.7 },
  { title: 'Becoming', author: 'Michelle Obama', genre: 'Biography', description: 'The inspiring memoir of the former First Lady.', coverImage: 'https://m.media-amazon.com/images/I/81h2gWPTYJL.jpg', rating: 4.8 },
  { title: 'The Power of Habit', author: 'Charles Duhigg', genre: 'Self-help', description: 'Understanding and changing habits.', coverImage: 'https://m.media-amazon.com/images/I/71UwSHSZRnS.jpg', rating: 4.6 },
  { title: 'Atomic Habits', author: 'James Clear', genre: 'Self-help', description: 'Tiny changes that lead to remarkable results.', coverImage: 'https://m.media-amazon.com/images/I/91bYsX41DVL.jpg', rating: 4.9 },
  { title: 'Man’s Search for Meaning', author: 'Viktor E. Frankl', genre: 'Psychology', description: 'A Holocaust survivor’s reflections on life and purpose.', coverImage: 'https://m.media-amazon.com/images/I/71VZ8J2WQKL.jpg', rating: 4.8 },
  { title: 'Quiet', author: 'Susan Cain', genre: 'Psychology', description: 'The power of introverts in a world that can’t stop talking.', coverImage: 'https://m.media-amazon.com/images/I/71kjW0+U6yL.jpg', rating: 4.6 },
  { title: 'Outliers', author: 'Malcolm Gladwell', genre: 'Psychology', description: 'The story of success and what makes high achievers different.', coverImage: 'https://m.media-amazon.com/images/I/81T8lEcU60L.jpg', rating: 4.7 },
  { title: 'Blink', author: 'Malcolm Gladwell', genre: 'Psychology', description: 'The power of thinking without thinking.', coverImage: 'https://m.media-amazon.com/images/I/81RrL+4SHwL.jpg', rating: 4.4 },
  { title: 'Thinking, Fast and Slow', author: 'Daniel Kahneman', genre: 'Psychology', description: 'A deep dive into human decision-making.', coverImage: 'https://m.media-amazon.com/images/I/71pSr7eMgnL.jpg', rating: 4.6 },

  // Fantasy & Sci-fi
  { title: 'Harry Potter and the Sorcerer’s Stone', author: 'J.K. Rowling', genre: 'Fantasy', description: 'A young boy discovers he’s a wizard.', coverImage: 'https://m.media-amazon.com/images/I/81YOuOGFCJL.jpg', rating: 4.9 },
  { title: 'Harry Potter and the Chamber of Secrets', author: 'J.K. Rowling', genre: 'Fantasy', description: 'Year two at Hogwarts with new dangers.', coverImage: 'https://m.media-amazon.com/images/I/91OINeHnJGL.jpg', rating: 4.8 },
  { title: 'A Game of Thrones', author: 'George R.R. Martin', genre: 'Fantasy', description: 'Noble houses vie for the Iron Throne.', coverImage: 'https://m.media-amazon.com/images/I/91dSMhdIzTL.jpg', rating: 4.8 },
  { title: 'The Name of the Wind', author: 'Patrick Rothfuss', genre: 'Fantasy', description: 'The story of a gifted young man who grows into a legend.', coverImage: 'https://m.media-amazon.com/images/I/91bYsX41DVL._AC_UY218_.jpg', rating: 4.7 },
  { title: 'Mistborn: The Final Empire', author: 'Brandon Sanderson', genre: 'Fantasy', description: 'A heist to overthrow a dark lord.', coverImage: 'https://m.media-amazon.com/images/I/91U4t8jUBpL.jpg', rating: 4.8 },
  { title: 'Dune', author: 'Frank Herbert', genre: 'Science Fiction', description: 'A young man’s destiny on a desert planet.', coverImage: 'https://m.media-amazon.com/images/I/91x3bXjR5zL.jpg', rating: 4.7 },
  { title: 'Ender’s Game', author: 'Orson Scott Card', genre: 'Science Fiction', description: 'A boy genius trained to save humanity.', coverImage: 'https://m.media-amazon.com/images/I/81vpsIs58WL.jpg', rating: 4.6 },
  { title: 'The Martian', author: 'Andy Weir', genre: 'Science Fiction', description: 'An astronaut’s survival on Mars.', coverImage: 'https://m.media-amazon.com/images/I/91wZtC5V6bL.jpg', rating: 4.8 },
  { title: 'Ready Player One', author: 'Ernest Cline', genre: 'Science Fiction', description: 'A virtual reality treasure hunt.', coverImage: 'https://m.media-amazon.com/images/I/81xR0y1zP-L.jpg', rating: 4.6 },
  { title: 'Neuromancer', author: 'William Gibson', genre: 'Cyberpunk', description: 'A hacker’s dangerous mission in a high-tech future.', coverImage: 'https://m.media-amazon.com/images/I/81Ls+SBEMDL.jpg', rating: 4.3 },

  // Mystery / Thriller
  { title: 'Gone Girl', author: 'Gillian Flynn', genre: 'Thriller', description: 'A twisted tale of a missing wife.', coverImage: 'https://m.media-amazon.com/images/I/81af+MCATTL._AC_UY218_.jpg', rating: 4.4 },
  { title: 'The Girl on the Train', author: 'Paula Hawkins', genre: 'Thriller', description: 'A woman’s obsession unravels a mystery.', coverImage: 'https://m.media-amazon.com/images/I/81VStYnDGrL.jpg', rating: 4.3 },
  { title: 'The Da Vinci Code', author: 'Dan Brown', genre: 'Mystery', description: 'A symbologist uncovers a shocking secret.', coverImage: 'https://m.media-amazon.com/images/I/91Q5dCjc2KL.jpg', rating: 4.6 },
  { title: 'Angels & Demons', author: 'Dan Brown', genre: 'Mystery', description: 'A race to stop a deadly conspiracy.', coverImage: 'https://m.media-amazon.com/images/I/91Pq7aD-2nL.jpg', rating: 4.5 },
  { title: 'Sherlock Holmes: A Study in Scarlet', author: 'Arthur Conan Doyle', genre: 'Mystery', description: 'The first appearance of Sherlock Holmes.', coverImage: 'https://m.media-amazon.com/images/I/81wwMByjc3L.jpg', rating: 4.7 },
  { title: 'And Then There Were None', author: 'Agatha Christie', genre: 'Mystery', description: 'Ten strangers are trapped on an island with a killer.', coverImage: 'https://m.media-amazon.com/images/I/81Bh+9-RA+L.jpg', rating: 4.8 },
  { title: 'Murder on the Orient Express', author: 'Agatha Christie', genre: 'Mystery', description: 'Hercule Poirot solves a murder on a train.', coverImage: 'https://m.media-amazon.com/images/I/81SH+LvXqVL.jpg', rating: 4.7 },
  { title: 'The Silent Patient', author: 'Alex Michaelides', genre: 'Thriller', description: 'A woman’s shocking act of violence and its aftermath.', coverImage: 'https://m.media-amazon.com/images/I/91a5-2mW1NL.jpg', rating: 4.5 },
  { title: 'The Shining', author: 'Stephen King', genre: 'Horror', description: 'A haunted hotel drives a man insane.', coverImage: 'https://m.media-amazon.com/images/I/81VStYnDGrL.jpg', rating: 4.8 },
  { title: 'It', author: 'Stephen King', genre: 'Horror', description: 'A group of kids face an evil clown.', coverImage: 'https://m.media-amazon.com/images/I/81eB+7+CkUL.jpg', rating: 4.6 },

  // Classics
  { title: 'Les Misérables', author: 'Victor Hugo', genre: 'Classic', description: 'A sweeping tale of love, justice, and redemption.', coverImage: 'https://m.media-amazon.com/images/I/81R7o5hR5AL.jpg', rating: 4.8 },
  { title: 'War and Peace', author: 'Leo Tolstoy', genre: 'Classic', description: 'A monumental novel about Russian society and war.', coverImage: 'https://m.media-amazon.com/images/I/91U4t8jUBpL.jpg', rating: 4.7 },
  { title: 'The Odyssey', author: 'Homer', genre: 'Epic', description: 'Odysseus’s long journey home after the Trojan War.', coverImage: 'https://m.media-amazon.com/images/I/81EJ0WYQ9JL.jpg', rating: 4.5 },
  { title: 'The Iliad', author: 'Homer', genre: 'Epic', description: 'A tale of heroism and tragedy during the Trojan War.', coverImage: 'https://m.media-amazon.com/images/I/91XU7pEBoHL.jpg', rating: 4.5 },
  { title: 'Frankenstein', author: 'Mary Shelley', genre: 'Gothic', description: 'A scientist creates a living being with dire consequences.', coverImage: 'https://m.media-amazon.com/images/I/81vpsIs58WL.jpg', rating: 4.4 },
  { title: 'Dracula', author: 'Bram Stoker', genre: 'Gothic', description: 'The classic vampire novel.', coverImage: 'https://m.media-amazon.com/images/I/81Zr2xqEKkL.jpg', rating: 4.5 },
  { title: 'Jane Eyre', author: 'Charlotte Brontë', genre: 'Classic', description: 'A young woman’s struggle for love and independence.', coverImage: 'https://m.media-amazon.com/images/I/81dpO8ts5QL.jpg', rating: 4.6 },
  { title: 'Wuthering Heights', author: 'Emily Brontë', genre: 'Classic', description: 'A tale of passion and revenge on the moors.', coverImage: 'https://m.media-amazon.com/images/I/81a4kCNuH+L.jpg', rating: 4.5 },
  { title: 'The Picture of Dorian Gray', author: 'Oscar Wilde', genre: 'Classic', description: 'A man remains young while his portrait ages.', coverImage: 'https://m.media-amazon.com/images/I/81eB+7+CkUL.jpg', rating: 4.6 },
  { title: 'Fahrenheit 451', author: 'Ray Bradbury', genre: 'Dystopian', description: 'A future where books are banned and burned.', coverImage: 'https://m.media-amazon.com/images/I/81WcnNQ-TBL.jpg', rating: 4.7 },
];

const seedBooks = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    await Book.deleteMany({});
    await Book.insertMany(books);
    console.log('Seeded 50 books with images and ratings successfully');
    mongoose.connection.close();
  } catch (err) {
    console.error('Seeding error:', err);
    mongoose.connection.close();
  }
};

seedBooks();
