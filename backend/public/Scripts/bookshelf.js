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

  let currentBookId = null;

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
      container.innerHTML = '';

      if (!bookshelf || bookshelf.length === 0) {
        container.innerHTML = '<p>No books in your bookshelf yet.</p>';
        return;
      }

      bookshelf.forEach(item => {
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
    } catch (err) {
      console.error('Error fetching bookshelf:', err);
    }
  }

  function openModal(book, status) {
    if (!book || !book._id) return;
    currentBookId = book._id;

    modalCover.src = book.coverImage || 'https://via.placeholder.com/120x180';
    modalTitle.textContent = book.title || 'Untitled';
    modalAuthor.textContent = book.author || 'Unknown Author';
    modalRating.textContent = book.rating ?? 'N/A';
    modalDescription.textContent = book.description || 'No description available';

    // status should already be in enum form: 'want-to-read', 'currently-reading', 'read'
    // if not, try to normalize common variants
    const normalized = (status || '').toString().toLowerCase();
    if (['want-to-read', 'currently-reading', 'read'].includes(normalized)) {
      modalStatusSelect.value = normalized;
    } else {
      // attempt to map some legacy/human strings if present
      if (normalized.includes('want')) modalStatusSelect.value = 'want-to-read';
      else if (normalized.includes('current') || normalized.includes('reading')) modalStatusSelect.value = 'currently-reading';
      else if (normalized.includes('read') || normalized.includes('finished')) modalStatusSelect.value = 'read';
      else modalStatusSelect.value = 'want-to-read';
    }

    modal.style.display = 'flex';
  }

  updateStatusBtn.addEventListener('click', async () => {
    const newStatus = modalStatusSelect.value; // this matches enum now
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

  fetchBookshelf();
});
