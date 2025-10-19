async function loadQuotes() {
  const res = await fetch('quotes.json');
  const quotes = await res.json();
  const container = document.getElementById('quotes-section');

  quotes.forEach((q, i) => {
    const div = document.createElement('div');
    div.className = 'quote';
    if (i === 0) div.classList.add('active');
    div.innerHTML = `“${q.text}”<cite>— ${q.book}, ${q.author}</cite>`;
    container.appendChild(div);
  });
  rotateQuotes(container.querySelectorAll('.quote'));
}

function rotateQuotes(quotes) {
  let idx = 0;
  setInterval(() => {
    quotes[idx].classList.remove('active');
    idx = (idx + 1) % quotes.length;
    quotes[idx].classList.add('active');
  }, 5000);
}

document.addEventListener('DOMContentLoaded', loadQuotes);
