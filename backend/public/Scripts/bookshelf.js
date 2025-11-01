document.addEventListener('DOMContentLoaded', async () => {
  const token = localStorage.getItem('token');
  if (!token) {
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
  const favoriteBookBtn = document.getElementById('favoriteBookBtn');
  const closeModal = document.getElementById('closeModal');
  const searchInput = document.getElementById('searchInput');
  const sortSelect = document.getElementById('sortSelect');

  let currentBookId = null;
  let currentBookStatus = null;
  let bookshelfData = [];
  let invertedIndex = {};

  // Inverted index creation
  function createInvertedIndex(books) {
    const index = {};
    books.forEach(book => {
      if (!book.bookId) return;
      const words = (book.bookId.title + " " + (book.bookId.author || "")).toLowerCase().split(/\W+/);
      words.forEach(word => {
        if (!word) return;
        if (!index[word]) index[word] = [];
        index[word].push(book);
      });
    });
    return index;
  }

  function searchBooks(query) {
    if (!query.trim()) return bookshelfData;
    const results = new Set();
    const words = query.toLowerCase().split(/\W+/);
    words.forEach(word => {
      const matches = invertedIndex[word];
      if (matches) matches.forEach(b => results.add(b));
    });
    return Array.from(results);
  }

  // Power sort for rating
  function powerSortBooks(books, order = 'high-to-low') {
    const arr = [...books];
    const n = arr.length;
    if (n <= 1) return arr;

    const compare = (a, b) => {
      const r1 = parseFloat(a.bookId?.rating) || 0;
      const r2 = parseFloat(b.bookId?.rating) || 0;
      return order === 'high-to-low' ? r2 - r1 : r1 - r2;
    };

    let runs = [];
    let i = 0;
    while (i < n) {
      let start = i++;
      if (i < n && compare(arr[i - 1], arr[i]) > 0) {
        while (i < n && compare(arr[i - 1], arr[i]) > 0) i++;
        runs.push({ start, end: i, descending: true });
      } else {
        while (i < n && compare(arr[i - 1], arr[i]) <= 0) i++;
        runs.push({ start, end: i, descending: false });
      }
    }

    for (const run of runs) {
      if (run.descending) {
        const sub = arr.slice(run.start, run.end).reverse();
        arr.splice(run.start, run.end - run.start, ...sub);
      }
    }

    function merge(left, right) {
      let result = [];
      while (left.length && right.length) {
        if (compare(left[0], right[0]) <= 0) result.push(left.shift());
        else result.push(right.shift());
      }
      return [...result, ...left, ...right];
    }

    while (runs.length > 1) {
      const run1 = runs.shift();
      const run2 = runs.shift();
      const merged = merge(
        arr.slice(run1.start, run1.end),
        arr.slice(run2.start, run2.end)
      );
      arr.splice(run1.start, merged.length, ...merged);
      runs.unshift({ start: run1.start, end: run1.start + merged.length });
    }

    return arr;
  }

  // Title sorting
  function sortByTitle(books, order = 'az') {
    return [...books].sort((a, b) => {
      const t1 = a.bookId?.title?.toLowerCase() || '';
      const t2 = b.bookId?.title?.toLowerCase() || '';
      if (t1 < t2) return order === 'az' ? -1 : 1;
      if (t1 > t2) return order === 'az' ? 1 : -1;
      return 0;
    });
  }

  function closeModalFunc() {
    modal.style.display = 'none';
    currentBookId = null;
    currentBookStatus = null;
  }

  closeModal.addEventListener('click', closeModalFunc);
  window.addEventListener('click', (e) => {
    if (e.target === modal) closeModalFunc();
  });

  // Fetch bookshelf
  async function fetchBookshelf() {
  try {
    const res = await fetch('/api/books/bookshelf', {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!res.ok) throw new Error(await res.text());
    const { bookshelf } = await res.json();

    // Filter out null or invalid bookId entries
    bookshelfData = (bookshelf || []).filter(item => item.bookId && item.bookId.title);

    if (bookshelfData.length === 0) {
      container.innerHTML = '<p>No books in your bookshelf yet.</p>';
      return;
    }

    // Rebuild search index only for valid books
    index = createInvertedIndex(bookshelfData);

    // Render bookshelf
    setTimeout(() => renderBookshelf(bookshelfData), 100);
  } catch (err) {
    console.error('Error fetching bookshelf:', err);
  }
}

  // Render bookshelf
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
        <h3>${book.title} ${item.favorite ? '❤️' : ''}</h3>
        <p>${item.status}</p>
      `;
      div.addEventListener('click', () => openModal(item));
      container.appendChild(div);
    });
  }

  // Modal open
  function openModal(item) {
    const book = item.bookId;
    if (!book || !book._id) return;
    currentBookId = book._id;
    currentBookStatus = item.status;

    modalCover.src = book.coverImage || 'https://via.placeholder.com/120x180';
    modalTitle.textContent = book.title || 'Untitled';
    modalAuthor.textContent = book.author || 'Unknown Author';
    modalRating.textContent = book.rating ?? 'N/A';
    modalDescription.textContent = book.description || 'No description available';
    modalStatusSelect.value = item.status || 'want-to-read';
    modal.style.display = 'flex';

    if (currentBookStatus === 'read') {
      favoriteBookBtn.disabled = false;
      favoriteBookBtn.style.opacity = '1';
      favoriteBookBtn.textContent = item.favorite ? 'Remove from Favorites' : 'Mark as Favorite';
    } else {
      favoriteBookBtn.disabled = true;
      favoriteBookBtn.style.opacity = '0.6';
      favoriteBookBtn.textContent = 'Mark as Favorite';
    }

    favoriteBookBtn.onclick = async () => {
      if (currentBookStatus !== 'read') return;
      const newFavoriteState = !item.favorite;

      try {
        const res = await fetch(`/api/books/bookshelf/${currentBookId}/favorite`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ favorite: newFavoriteState })
        });

        if (!res.ok) throw new Error(await res.text());
        closeModalFunc();
        fetchBookshelf();
      } catch (err) {
        console.error('Favorite update failed:', err);
        alert('Error updating favorite');
      }
    };
  }

  // Update status
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

      if (!res.ok) throw new Error(await res.text());
      alert('Status updated successfully');
      closeModalFunc();
      fetchBookshelf();
    } catch (err) {
      console.error('Error updating status:', err);
      alert('Error updating status');
    }
  });

  // Delete book
  deleteBookBtn.addEventListener('click', async () => {
    if (!currentBookId) return;
    if (!confirm('Are you sure you want to delete this book?')) return;

    try {
      const res = await fetch(`/api/books/bookshelf/${currentBookId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!res.ok) throw new Error(await res.text());
      closeModalFunc();
      fetchBookshelf();
    } catch (err) {
      console.error('Error deleting book:', err);
      alert('Error deleting book');
    }
  });

  // Search
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      const query = e.target.value.trim();
      const results = searchBooks(query);
      renderBookshelf(results);
    });
  }

  // Sort
  if (sortSelect) {
    sortSelect.addEventListener('change', (e) => {
      let sorted = bookshelfData;
      const val = e.target.value;

      if (val === 'high-to-low' || val === 'low-to-high') {
        sorted = powerSortBooks(bookshelfData, val);
      } else if (val === 'title-az') {
        sorted = sortByTitle(bookshelfData, 'az');
      } else if (val === 'title-za') {
        sorted = sortByTitle(bookshelfData, 'za');
      } else if (val === 'favorite') {
        sorted = bookshelfData.filter(b => b.favorite === true);
      }
      renderBookshelf(sorted);
    });
  }

  fetchBookshelf();
});

// Hamburger menu
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
