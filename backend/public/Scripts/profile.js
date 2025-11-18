document.addEventListener('DOMContentLoaded', async () => {
  const fullName = localStorage.getItem('fullName');
  const email = localStorage.getItem('email');
  const token = localStorage.getItem('token');

  if (!fullName || !token) {
    window.location.href = '/login.html';
    return;
  }

  document.getElementById('userName').textContent = fullName;

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

  logoutBtn.addEventListener('click', () => {
    localStorage.removeItem('token');
    localStorage.removeItem('fullName');
    localStorage.removeItem('email');
    window.location.href = '/login.html?loggedOut=true';
  });

  // Fetch bookshelf stats
  try {
    const res = await fetch('/api/books/bookshelf', {
      headers: { 'Authorization': `Bearer ${token}` }
    });

    if (!res.ok) throw new Error('Failed to fetch bookshelf data');

    const { bookshelf } = await res.json();
    const validBooks = bookshelf.filter(b => b.bookId);

    const wantToRead = validBooks.filter(b => b.status === 'want-to-read').length;
    const reading = validBooks.filter(b => b.status === 'currently-reading').length;
    const read = validBooks.filter(b => b.status === 'read').length;
    const favorites = validBooks.filter(b => b.favorite === true).length;

    document.getElementById('totalBooks').textContent = validBooks.length;
    document.getElementById('want-to-read').textContent = wantToRead;
    document.getElementById('currently-reading').textContent = reading;
    document.getElementById('read').textContent = read;
    document.getElementById('favoriteBooks').textContent = favorites;

  } catch (err) {
    console.error('Error fetching stats:', err);
  }
});
