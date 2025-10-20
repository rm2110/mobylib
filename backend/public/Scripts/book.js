const bookId = new URLSearchParams(window.location.search).get('id');

  async function fetchBookDetails() {
    const res = await fetch(`/api/books/${bookId}`);
    const book = await res.json();

    document.getElementById('bookTitle').innerText = book.title;
    document.getElementById('bookAuthor').innerText = book.author || 'Unknown Author';
    document.getElementById('bookDescription').innerText = book.description || 'No description available.';
    document.getElementById('bookRating').innerText = book.rating || 'N/A';
    document.getElementById('bookCover').src = book.coverImage || 'https://via.placeholder.com/250x350?text=No+Cover';
  }

  async function checkIfBookInBookshelf() {
    const token = localStorage.getItem('token');
    if (!token) return;

    const res = await fetch('/api/books/bookshelf', {
      headers: { 'Authorization': `Bearer ${token}` }
    });

    if (!res.ok) return;
    const data = await res.json();
    const bookshelf = data.bookshelf;

    const alreadyExists = bookshelf.some(entry => entry.bookId._id === bookId);

    if (alreadyExists) {
      document.getElementById('statusSelect').style.display = 'none';
      const saveBtn = document.getElementById('saveStatusBtn');
      saveBtn.replaceWith(document.createTextNode('Book already in bookshelf!'));
    }
  }

  document.getElementById('saveStatusBtn').addEventListener('click', async () => {
    const status = document.getElementById('statusSelect').value;
    const token = localStorage.getItem('token');

    const res = await fetch('/api/books/status', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ bookId, status })
    });

    if (res.ok) {
      alert('Book added to Bookshelf!');
      window.location.href = '/dashboard.html';
    } else {
      alert('Failed to add to Bookshelf :(');
    }
  });

  fetchBookDetails();
  checkIfBookInBookshelf();