// Nexora Travel — front-end interactivity (no backend required)
document.addEventListener('DOMContentLoaded', () => {

  const toast = document.getElementById('toast');
  let toastTimer;
  function showToast(msg) {
    toast.textContent = msg;
    toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('show'), 2200);
  }

  // ---- Search tabs ----
  document.querySelectorAll('.tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      showToast(`Switched to ${tab.textContent.trim()} search`);
    });
  });

  document.getElementById('searchBtn')?.addEventListener('click', () => {
    showToast('Searching best fares for Bengaluru → Dubai…');
  });

  // ---- Destination + hotel + deal cards ----
  document.querySelectorAll('.dest-card').forEach(card => {
    card.addEventListener('click', () => {
      const name = card.querySelector('span')?.textContent;
      showToast(`Exploring trips to ${name}…`);
    });
  });

  document.querySelectorAll('.deal-card').forEach(card => {
    card.addEventListener('click', () => {
      const route = card.querySelector('.deal-route')?.textContent;
      showToast(`Opening fare details for ${route}`);
    });
  });

  document.querySelectorAll('.btn-book').forEach(btn => {
    btn.addEventListener('click', () => {
      const hotel = btn.closest('.hotel-card')?.querySelector('h3')?.textContent;
      showToast(`Booking request sent for ${hotel}`);
    });
  });

  // ---- Pod / environment badge ----
  const podBadge = document.getElementById('podBadge');
  const podId = 'pod-' + Math.random().toString(36).slice(2, 8);
  podBadge.textContent = `Served by ${podId} · ${window.location.hostname}${window.location.pathname}`;
});
