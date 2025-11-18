document.addEventListener('DOMContentLoaded', async () => {
  const token = localStorage.getItem('token');
  const urlParams = new URLSearchParams(window.location.search);
  const bookId = urlParams.get('id');

  if (!bookId) {
    alert('No book selected!');
    return;
  }

  const bookCoverEl = document.getElementById('bookCover');
  const bookTitleEl = document.getElementById('bookTitle');
  const bookAuthorEl = document.getElementById('bookAuthor');
  const bookRatingEl = document.getElementById('bookRating');
  const bookDescriptionEl = document.getElementById('bookDescription');
  const saveBtn = document.getElementById('saveStatusBtn');
  const statusSelect = document.getElementById('statusSelect');

  function matchesBookId(entryBookId, pageBookId) {
    if (!entryBookId) return false;
    if (typeof entryBookId === 'object') {
      const maybeId = entryBookId._id || entryBookId.id;
      if (maybeId) return maybeId.toString() === pageBookId.toString();
      return JSON.stringify(entryBookId).includes(pageBookId);
    }
    return entryBookId.toString() === pageBookId.toString();
  }

  function coverFromBook(book) {
    return book.coverImage || '/Images/placeholder.png';
  }

  try {
    const bRes = await fetch(`/api/books/${bookId}`);
    if (!bRes.ok) throw new Error('Failed to fetch book details');
    const book = await bRes.json();

    bookCoverEl.src = coverFromBook(book);
    bookTitleEl.textContent = book.title || 'Untitled';
    bookAuthorEl.textContent = book.author ? `by ${book.author}` : '';
    bookRatingEl.textContent = book.rating ?? 'N/A';
    bookDescriptionEl.textContent = book.description || 'No description available';

    saveBtn.disabled = false;
    saveBtn.textContent = 'Add';

    let bookshelf = [];
    if (token) {
      const shelfRes = await fetch('/api/books/bookshelf', {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (shelfRes.ok) {
        const payload = await shelfRes.json();
        bookshelf = payload.bookshelf || payload || [];
      } else {
        console.warn('Failed to fetch bookshelf for check:', await shelfRes.text());
      }
    }

    const existingEntry = bookshelf.find(entry => matchesBookId(entry.bookId, bookId));

    if (existingEntry) {
      saveBtn.textContent = 'Already Added';
      saveBtn.disabled = true;

      if (existingEntry.status) statusSelect.value = existingEntry.status;
    } else {
      saveBtn.addEventListener('click', async () => {
        const status = statusSelect.value;
        if (!token) {
          alert('Please log in to add this book.');
          window.location.href = '/login.html';
          return;
        }

        try {
          const addRes = await fetch('/api/books/status', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({ bookId, status })
          });

          const addData = await addRes.json();
          if (addRes.ok) {
            saveBtn.textContent = 'Already Added';
            saveBtn.opacity = '0.6';
            saveBtn.disabled = true;
          } else {
            alert(addData.message || 'Failed to add book.');
          }
        } catch (err) {
          console.error('Error adding book:', err);
          alert('Error adding book (see console).');
        }
      });
    }

    if (existingEntry) {
      statusSelect.addEventListener('change', async () => {
        const newStatus = statusSelect.value;
        if (!token) return alert('Please log in.');

        try {
          const patchRes = await fetch(`/api/books/bookshelf/${bookId}`, {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({ status: newStatus })
          });
          if (!patchRes.ok) {
            const t = await patchRes.text();
            console.error('Failed to update status:', patchRes.status, t);
            alert('Failed to update status.');
            return;
          }
        } catch (err) {
          console.error('Error updating status:', err);
          alert('Error updating status.');
        }
      });
    }

  } catch (err) {
    console.error('Error loading book page:', err);
  }
});
