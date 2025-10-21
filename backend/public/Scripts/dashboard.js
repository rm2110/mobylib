document.addEventListener('DOMContentLoaded', () => {
  const fullName = localStorage.getItem('fullName');
  if (!fullName) {
    window.location.href = '/login.html';
    return;
  }

  document.getElementById('greeting').textContent = `Hi, ${fullName}`;

  // Sidebar & logout
  const hamburger = document.getElementById('hamburger');
  const sidebar = document.getElementById('sideMenu');
  const overlay = document.getElementById('menuOverlay');

  hamburger.addEventListener('click', () => {
    sidebar.classList.add('show');
    overlay.classList.add('show');
  });

  overlay.addEventListener('click', () => {
    sidebar.classList.remove('show');
    overlay.classList.remove('show');
  });

  logoutBtn.addEventListener('click', () => {
    localStorage.removeItem('token');
    localStorage.removeItem('fullName');
    window.location.href = '/login.html?loggedOut=true';
  });
});

// Live Search 
document.addEventListener('DOMContentLoaded', () => {
  const searchInput = document.getElementById('bookSearch');
  const searchResults = document.getElementById('searchResults');

  searchInput.addEventListener('input', async () => {
    const query = searchInput.value.trim();
    searchResults.innerHTML = '';
    if (query.length === 0) return;

    try {
      const res = await fetch(`/api/books?q=${encodeURIComponent(query)}`);
      if (!res.ok) {
        console.error('Search failed');
        return;
      }
      const books = await res.json();

      if (books.length === 0) {
        searchResults.innerHTML = '<p>No books found</p>';
        return;
      }

      books.forEach(book => {
        const div = document.createElement('div');
        div.classList.add('book-result');
        div.innerHTML = `
          <img src="${book.coverImage}" alt="${book.title}" style="width:50px;height:70px;object-fit:cover;">
          <span>${book.title}</span>
        `;
        div.addEventListener('click', () => {
          window.location.href = `/book.html?id=${book._id}`;
        });
        searchResults.appendChild(div);
      });
    } catch (err) {
      console.error('Search error:', err);
    }
  });
});

// Bookshelf Fetch
async function fetchBookshelf() {
  const token = localStorage.getItem('token');
  if (!token) {
    console.error('No token found');
    return;
  }

  try {
    const res = await fetch('/api/books/bookshelf', {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    if (!res.ok) {
      console.error('Failed to fetch bookshelf:', await res.text());
      return;
    }

    const { bookshelf } = await res.json();
    const container = document.getElementById('bookshelfContainer');
    container.innerHTML = '';

    if (!bookshelf || bookshelf.length === 0) {
      container.innerHTML = '<p>No books added yet</p>';
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
    console.error('Bookshelf fetch error:', err);
  }
}

// Run on page load
document.addEventListener('DOMContentLoaded', fetchBookshelf);
