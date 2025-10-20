document.addEventListener('DOMContentLoaded', async () => {
  const token = localStorage.getItem('token');
  if (!token) {
    console.error('No token found');
    window.location.href = '/login.html';
    return;
  }

  const container = document.getElementById('bookshelfContainer');
  const modal = document.getElementById('bookModal');
  const modalCover = document.getElementById('modalCover');
  const modalTitle = document.getElementById('modalTitle');
  const modalAuthor = document.getElementById('modalAuthor');
  const modalRating = document.getElementById('modalRating');
  const modalDescription = document.getElementById('modalDescription');
  const modalStatusSelect = document.getElementById('modalStatusSelect');
  const updateStatusBtn = document.getElementById('updateStatusBtn');
  const deleteBookBtn = document.getElementById('deleteBookBtn');
  const closeModal = document.getElementById('closeModal');
  const searchInput = document.getElementById('searchInput');
  const sortSelect = document.getElementById('sortSelect');

  let currentBookId = null;
  let bookshelfData = [];

  // Linear search
  function searchBooks(query, books) {
    return books.filter(item =>
      item.bookId.title.toLowerCase().includes(query.toLowerCase()) ||
      (item.bookId.author && item.bookId.author.toLowerCase().includes(query.toLowerCase()))
    );
  }

  // Bubble sort for ratings
  function bubbleSortBooks(books, order = 'high-to-low') {
    let arr = [...books];
    let n = arr.length;
    for (let i = 0; i < n - 1; i++) {
      for (let j = 0; j < n - i - 1; j++) {
        const r1 = parseFloat(arr[j].bookId.rating) || 0;
        const r2 = parseFloat(arr[j + 1].bookId.rating) || 0;
        if ((order === 'high-to-low' && r1 < r2) ||
            (order === 'low-to-high' && r1 > r2)) {
          [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
        }
      }
    }
    return arr;
  }

  // Title sorting
  function sortByTitle(books, order = 'az') {
    let arr = [...books];
    arr.sort((a, b) => {
      const t1 = a.bookId.title.toLowerCase();
      const t2 = b.bookId.title.toLowerCase();
      if (t1 < t2) return order === 'az' ? -1 : 1;
      if (t1 > t2) return order === 'az' ? 1 : -1;
      return 0;
    });
    return arr;
  }

  function closeModalFunc() {
    modal.style.display = 'none';
    currentBookId = null;
  }

  closeModal.addEventListener('click', closeModalFunc);
  window.addEventListener('click', (e) => {
    if (e.target === modal) closeModalFunc();
  });

  async function fetchBookshelf() {
    try {
      const res = await fetch('/api/books/bookshelf', {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (!res.ok) {
        console.error('Failed to fetch bookshelf:', await res.text());
        return;
      }

      const { bookshelf } = await res.json();
      bookshelfData = bookshelf || [];
      renderBookshelf(bookshelfData);
    } catch (err) {
      console.error('Error fetching bookshelf:', err);
    }
  }

  function renderBookshelf(books) {
    container.innerHTML = '';

    if (!books || books.length === 0) {
      container.innerHTML = '<p>No books in your bookshelf yet.</p>';
      return;
    }

    books.forEach(item => {
      const book = item.bookId;
      if (!book) return;

      const div = document.createElement('div');
      div.classList.add('book-item');
      div.innerHTML = `
        <img src="${book.coverImage || 'https://via.placeholder.com/100x150'}" alt="${book.title}">
        <h3>${book.title}</h3>
        <p>${item.status}</p>
      `;
      div.addEventListener('click', () => openModal(book, item.status));
      container.appendChild(div);
    });
  }

  function openModal(book, status) {
    if (!book || !book._id) return;
    currentBookId = book._id;

    modalCover.src = book.coverImage || 'https://via.placeholder.com/120x180';
    modalTitle.textContent = book.title || 'Untitled';
    modalAuthor.textContent = book.author || 'Unknown Author';
    modalRating.textContent = book.rating ?? 'N/A';
    modalDescription.textContent = book.description || 'No description available';

    const normalized = (status || '').toString().toLowerCase();
    if (['want-to-read', 'currently-reading', 'read'].includes(normalized)) {
      modalStatusSelect.value = normalized;
    } else {
      if (normalized.includes('want')) modalStatusSelect.value = 'want-to-read';
      else if (normalized.includes('current') || normalized.includes('reading')) modalStatusSelect.value = 'currently-reading';
      else if (normalized.includes('read') || normalized.includes('finished')) modalStatusSelect.value = 'read';
      else modalStatusSelect.value = 'want-to-read';
    }

    modal.style.display = 'flex';
  }

  updateStatusBtn.addEventListener('click', async () => {
    const newStatus = modalStatusSelect.value;
    if (!currentBookId) return;

    try {
      const res = await fetch(`/api/books/bookshelf/${currentBookId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      });

      if (!res.ok) {
        const text = await res.text();
        console.error('Failed to update status:', res.status, text);
        alert('Failed to update status. See console for details.');
        return;
      }

      alert('Status updated successfully');
      closeModalFunc();
      fetchBookshelf();
    } catch (err) {
      console.error('Error updating status:', err);
      alert('Error updating status. See console for details.');
    }
  });

  deleteBookBtn.addEventListener('click', async () => {
    if (!currentBookId) return;
    if (!confirm('Are you sure you want to delete this book from your bookshelf?')) return;

    try {
      const res = await fetch(`/api/books/bookshelf/${currentBookId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (!res.ok) {
        const text = await res.text();
        console.error('Failed to delete book:', res.status, text);
        alert('Failed to delete book. See console for details.');
        return;
      }

      closeModalFunc();
      fetchBookshelf();
    } catch (err) {
      console.error('Error deleting book:', err);
      alert('Error deleting book. See console for details.');
    }
  });

  // Search event
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      const filtered = searchBooks(e.target.value, bookshelfData);
      renderBookshelf(filtered);
    });
  }

  // Sort event
  if (sortSelect) {
    sortSelect.addEventListener('change', (e) => {
      let sorted = bookshelfData;
      if (e.target.value === 'high-to-low' || e.target.value === 'low-to-high') {
        sorted = bubbleSortBooks(bookshelfData, e.target.value);
      } else if (e.target.value === 'title-az') {
        sorted = sortByTitle(bookshelfData, 'az');
      } else if (e.target.value === 'title-za') {
        sorted = sortByTitle(bookshelfData, 'za');
      }
      renderBookshelf(sorted);
    });
  }

  fetchBookshelf();
});

const hamburger = document.getElementById('hamburger');
const sideMenu = document.getElementById('sideMenu');
const menuOverlay = document.getElementById('menuOverlay');
const logoutBtn = document.getElementById('logoutBtn');

hamburger.addEventListener('click', () => {
  sideMenu.classList.add('show');
  menuOverlay.classList.add('show');
});

menuOverlay.addEventListener('click', () => {
  sideMenu.classList.remove('show');
  menuOverlay.classList.remove('show');
});

if (logoutBtn) {
  logoutBtn.addEventListener('click', (e) => {
    e.preventDefault();
    localStorage.removeItem('token');
    window.location.href = '/login.html';
  });
}
