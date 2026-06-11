# MobyLib

MobyLib is a full-stack book tracking web application that helps users organize and manage their personal reading journey. Users can search books, maintain a digital bookshelf, track reading progress, mark favorite books, and view personalized reading statistics through an intuitive dashboard.

---

## Features

### User Authentication

* Secure user registration and login
* Password hashing using bcrypt
* JWT-based authentication
* Protected routes for authenticated users

### Book Search

* Search books by title
* Real-time search functionality
* Dynamic result display
* Detailed book information page

### Personal Bookshelf

* Add books to personal bookshelf
* Track reading status:

  * Want to Read
  * Currently Reading
  * Read
* Update reading status anytime
* Remove books from bookshelf
* Mark completed books as favorites

### Dashboard

* Personalized user greeting
* Book search interface
* Quick navigation to bookshelf and profile

### Profile Statistics

* Total books tracked
* Want-to-read count
* Currently-reading count
* Read books count
* Favorite books count

### Bookshelf Management

* Search within bookshelf
* Sort books by:

  * Rating (High → Low)
  * Rating (Low → High)
  * Title (A → Z)
  * Title (Z → A)
  * Favorites
* Detailed modal view for each book

---

## System Architecture

Frontend (React.js)
⬇
Axios API Calls
⬇
Node.js + Express.js Backend
⬇
MongoDB Database

---

## Tech Stack

### Frontend

* React.js
* React Router DOM
* Axios
* CSS3

### Backend

* Node.js
* Express.js

### Database

* MongoDB
* Mongoose

### Authentication

* JSON Web Tokens (JWT)
* bcrypt.js

### Development Tools

* Git
* VS Code
* MongoDB Compass
* Postman

---

## Project Structure

MobyLib

frontend/
├── public/
│   └── Images/
├── src/
│   ├── pages/
│   │   ├── Home.js
│   │   ├── Login.js
│   │   ├── Signup.js
│   │   ├── Dashboard.js
│   │   ├── Bookshelf.js
│   │   ├── Profile.js
│   │   └── BookDetails.js
│   ├── App.js
│   └── index.js

backend/
├── models/
│   ├── User.js
│   └── Book.js
├── routes/
│   ├── authRoutes.js
│   └── bookRoutes.js
├── seedBooks.js
├── server.js
└── .env

---

## ⚙️ Installation

### 1. Clone Repository

git clone <repository-url>

cd mobylib

---

### 2. Install Backend Dependencies

cd backend

npm install

---

### 3. Install Frontend Dependencies

cd ../frontend

npm install

---

### 4. Configure Environment Variables

Create a .env file inside backend/

MONGO_URI=your_mongodb_connection_string

JWT_SECRET=your_secret_key

PORT=5000

---

### 5. Seed Database

Navigate to backend folder:

node seedBooks.js

This populates MongoDB with sample books, ratings, descriptions, and cover images.

---

## Running the Application

### Start Backend

cd backend

npm start

Server runs at:

http://localhost:5000

---

### Start Frontend

cd frontend

npm start

Application runs at:

http://localhost:3000

---

## API Endpoints

### Authentication

POST /api/auth/signup

Create a new user account.

POST /api/auth/login

Authenticate user and return JWT token.

---

### Books

GET /api/books?q=searchTerm

Search books by title.

GET /api/books/:id

Fetch details of a specific book.

POST /api/books/status

Add a book to user's bookshelf.

GET /api/books/bookshelf

Retrieve user's bookshelf.

PATCH /api/books/bookshelf/:bookId

Update reading status.

DELETE /api/books/bookshelf/:bookId

Remove book from bookshelf.

PATCH /api/books/bookshelf/:bookId/favorite

Toggle favorite status.

---

## Security Features

* Password hashing with bcrypt
* JWT authentication
* Protected API routes
* Authorization middleware
* Secure user-specific bookshelf access

---

## Authors

* Rishi Jyotirmay Mahajan
* Vimal Suresh P
