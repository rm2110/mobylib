document.addEventListener('DOMContentLoaded', async () => {
  const params = new URLSearchParams(window.location.search);
  const bookId = params.get('id');

  if (!bookId) {
    alert('No book selected');
    window.location.href = '/dashboard.html';
    return;
  }

  try {
    const res = await fetch(`/api/books/${bookId}`);
    const book = await res.json();

    document.getElementById('bookTitle').textContent = book.title;
    document.getElementById('bookAuthor').textContent = book.author;
    document.getElementById('bookDescription').textContent = book.description || 'No description available';
    document.getElementById('bookImage').src = book.coverImage || 'https://placehold.co/200x300/png';

    // Save reading status
    document.getElementById('saveStatusBtn').addEventListener('click', async () => {
      const status = document.getElementById('bookStatus').value;
      const token = localStorage.getItem('token');

      if (!token) {
        alert('Please log in first');
        window.location.href = '/login.html';
        return;
      }

      const response = await fetch('/api/books/status', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ bookId, status })
      });

      const data = await response.json();
      if (response.ok) {
        alert('Book status saved!');
      } else {
        alert(data.message || 'Failed to save status');
      }
    });
  } catch (err) {
    console.error('Error fetching book details:', err);
  }
});
