document.addEventListener('DOMContentLoaded', () => {
  const fullName = localStorage.getItem('fullName');

  // If no user, redirect back to login
  if (!fullName) {
    window.location.href = '/login.html';
    return;
  }

  // Show greeting
  const greeting = document.getElementById('greeting');
  greeting.textContent = `Hi, ${fullName}`;

  // Logout functionality
  const logoutBtn = document.getElementById('logoutBtn');
  logoutBtn.addEventListener('click', () => {
    localStorage.removeItem('token');
    localStorage.removeItem('fullName');

    // Redirect to login with message
    const params = new URLSearchParams();
    params.append('loggedOut', 'true');
    window.location.href = `/login.html?${params.toString()}`;
  });
});
