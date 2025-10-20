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
