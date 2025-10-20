document.addEventListener('DOMContentLoaded', async () => {
  const token = localStorage.getItem('token');
  if (!token) {
    console.error('No token found');
    window.location.href = '/login.html';
    return;
  }

  try {
    const res = await fetch('/api/books/bookshelf', {
      headers: { 'Authorization': `Bearer ${token}` }
    });

    if (!res.ok) {
      console.error('Failed to fetch bookshelf');
      return;
    }

    const { bookshelf } = await res.json();
    const container = document.getElementById('bookshelfContainer');
    container.innerHTML = '';

    if (bookshelf.length === 0) {
      container.innerHTML = '<p>No books in your bookshelf yet.</p>';
      return;
    }

    bookshelf.forEach(item => {
      const book = item.bookId;
      if (!book) return; 

      const div = document.createElement('div');
      div.classList.add('book-item');
      div.innerHTML = `
        <img src="${book.coverImage}" alt="${book.title}" style="width:100px;height:auto;object-fit:cover;">
        <h3>${book.title}</h3>
        <p>${item.status}</p>
      `;
      div.addEventListener('click', () => {
        window.location.href = `/book.html?id=${book._id}`;
      });
      container.appendChild(div);
    });

  } catch (err) {
    console.error('Error fetching bookshelf:', err);
  }
});
