# MobyLib: Track Books, Stay Inspired
MobyLib is a full-stack web application designed to help users organize, track, and manage their personal bookshelf.

---

# Features

* #### User Management

  * Secure JWT-based authentication (Signup / Login / Logout).
  * Personalized user profile with name, email, and bookshelf stats.
  
* #### Bookshelf Management

  * Add, update, and remove books from your collection.
  * Track reading progress with statuses:
    * Want to Read
    * Currently Reading
    * Read
  * Mark books as Favorites (only for “Read” books).
  
* #### Smart Search

  * Inverted Index Search Algorithm for fast, local book lookups.
  * Real-time suggestions while typing.
  
* #### Intelligent Sorting

  * PowerSort Algorithm for adaptive, high-performance sorting based on book ratings or titles.
  * Supports both ascending and descending order.
  
* #### Profile Dashboard

  * Displays real-time stats:
    * Total books
    * Books per reading status
    * Favorite books count
   
* #### Persistent Storage

  * MongoDB database for all user and book data.
  * Data automatically synced to each user’s account.
---

# Tech Stack

- **Frontend:** HTML, CSS, Vanilla JavaScript
- **Backend:** Node.js, Express.js
- **Database:** MongoDB 
- **Authentication:** JSON Web Tokens (JWT)
- **Other Tools:**  REST APIs, Git/GitHub

---

# Installation & Setup

1. #### Clone the repository:


   ```bash
   git clone https://github.com/your-username/mobylib.git
   cd mobylib
   ```
2. #### Install dependencies:

   ``bash npm install ``

3. #### Setup environment variables:
   Create a .env file inside /backend with:
   ```
       MONGO_URI=mongodb://127.0.0.1:27017/mobylib
       JWT_SECRET=yourSecretKey
       PORT=5000
   ```
4. #### Seed the database:
   ```
     node backend/bookSeed.js
   ```
5. #### Run the server:
   ```
     npm start
   ```
6. #### Access the app:
   ```
     http://localhost:5000
   ```
