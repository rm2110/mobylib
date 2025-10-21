document.addEventListener('DOMContentLoaded', async () => {
  const fullName = localStorage.getItem('fullName');
  const email = localStorage.getItem('email');
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user'));


  if (!token || !user) {
    window.location.href = '/login.html';
    return;
  }

  document.getElementById('userName').textContent = user.fullName || 'User Name';
  document.getElementById('userEmail').textContent = user.email || 'Email not available';

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
    const total = bookshelf.length;
    const wantToRead = bookshelf.filter(b => b.status === 'want-to-read').length;
    const reading = bookshelf.filter(b => b.status === 'currently-reading').length;
    const read = bookshelf.filter(b => b.status === 'read').length;
    const favorites = bookshelf.filter(b => b.favorite === true).length;

    document.getElementById('totalBooks').textContent = total;
    document.getElementById('want-to-read').textContent = wantToRead;
    document.getElementById('currently-reading').textContent = reading;
    document.getElementById('read').textContent = read;
    document.getElementById('favoriteBooks').textContent = favorites; 

  } catch (err) {
    console.error('Error fetching stats:', err);
  }
});

const favorites = bookshelf.filter(item => item.favorite).length;
document.getElementById('favoriteBooks').textContent = favorites;
