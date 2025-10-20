document.addEventListener('DOMContentLoaded', () => {
  const fullName = localStorage.getItem('fullName');
  if (!fullName) {
    window.location.href = '/login.html';
    return;
  }

  // Show greeting
  document.getElementById('greeting').textContent = `Hi, ${fullName}`;

  // Elements
  const hamburger = document.getElementById('hamburger');
  const sidebar = document.getElementById('sidebar');
  const overlay = document.getElementById('overlay');
  const logoutBtn = document.getElementById('logoutBtn');

  // Open sidebar
  hamburger.addEventListener('click', () => {
    sidebar.classList.add('active');
    overlay.classList.add('active');
  });

  // Close sidebar when clicking outside
  overlay.addEventListener('click', () => {
    sidebar.classList.remove('active');
    overlay.classList.remove('active');
  });

  // Logout functionality
  logoutBtn.addEventListener('click', () => {
    localStorage.removeItem('token');
    localStorage.removeItem('fullName');
    const params = new URLSearchParams();
    params.append('loggedOut', 'true');
    window.location.href = `/login.html?${params.toString()}`;
  });
});

document.addEventListener('DOMContentLoaded', () => {
  const searchBtn = document.getElementById('searchBtn');
  const searchInput = document.getElementById('bookSearch');
  const searchResults = document.getElementById('searchResults');

  async function searchBooks() {
    const query = searchInput.value.trim();
    const res = await fetch(`/api/books?query=${encodeURIComponent(query)}`);
    const books = await res.json();

    searchResults.innerHTML = '';
    books.forEach(book => {
      const div = document.createElement('div');
      div.className = 'book-card';
      div.innerHTML = `
        <img src="${book.coverImage}" alt="${book.title}" style="width:100px;height:150px;object-fit:cover;"><br>
        <strong>${book.title}</strong><br>
        <em>${book.author}</em>
      `;
      div.addEventListener('click', () => {
        window.location.href = `/bookDetails.html?id=${book._id}`;
      });
      searchResults.appendChild(div);
    });
  }

  searchBtn.addEventListener('click', searchBooks);
  searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') searchBooks();
  });
});

document.addEventListener('DOMContentLoaded', () => {
  const searchInput = document.getElementById('bookSearch');
  const searchResults = document.getElementById('searchResults');

  searchInput.addEventListener('input', async () => {
    const query = searchInput.value.trim();
    searchResults.innerHTML = '';

    if (query.length === 0) return;

    try {
      const res = await fetch(`/api/books?q=${encodeURIComponent(query)}`);
      const books = await res.json();

      if (books.length === 0) {
        searchResults.innerHTML = '<p>No books found</p>';
        return;
      }

      books.forEach(book => {
        const div = document.createElement('div');
        div.classList.add('book-result');
        div.textContent = book.title;
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
