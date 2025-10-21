// Show logout message if redirected from dashboard
const urlParams = new URLSearchParams(window.location.search);
if (urlParams.get('loggedOut') === 'true') {
  alert('Successfully logged out.');
}

document.addEventListener('DOMContentLoaded', () => {
  const form = document.querySelector('form');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = form.querySelector('input[type="email"]').value.trim();
    const password = form.querySelector('input[type="password"]').value;

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        // Store token and user name in localStorage
        localStorage.setItem('token', data.token);
        localStorage.setItem('fullName', data.user.fullName);

        // Redirect to dashboard (no alert here)
        window.location.href = '/dashboard.html';
      } else {
        alert(data.message || 'Login failed');
      }
    } catch (err) {
      console.error('Login error:', err);
      alert('Something went wrong. Please try again.');
    }
  });
});