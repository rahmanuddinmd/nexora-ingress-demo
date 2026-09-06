// Nexora Movies — front-end interactivity (no backend required)
document.addEventListener('DOMContentLoaded', () => {

  const toast = document.getElementById('toast');
  let toastTimer;
  function showToast(msg) {
    toast.textContent = msg;
    toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('show'), 2200);
  }

  // ---- Book buttons ----
  document.querySelectorAll('.btn-book, .btn-glow').forEach(btn => {
    btn.addEventListener('click', () => {
      const card = btn.closest('.movie-card');
      const title = card ? card.querySelector('h3').textContent : 'The Last Voyage';
      showToast(`Booking flow started for "${title}"`);
      document.getElementById('seatGrid')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    });
  });

  document.getElementById('trailerBtn')?.addEventListener('click', () => {
    showToast('Playing trailer preview…');
  });

  // ---- Showtime pills ----
  document.querySelectorAll('.time-pill').forEach(pill => {
    pill.addEventListener('click', () => {
      document.querySelectorAll('.time-pill').forEach(p => p.classList.remove('hot'));
      pill.classList.add('hot');
      showToast(`Showtime ${pill.firstChild.textContent.trim()} selected`);
    });
  });

  // ---- Generate seat grid ----
  const seatGrid = document.getElementById('seatGrid');
  const rows = 6, cols = 12;
  const bookedSeats = new Set(['2-4','2-5','3-8','4-1','5-10','5-11']);
  const premiumRows = new Set([0, 1]);
  let selectedCount = 0;

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const seat = document.createElement('div');
      const key = `${r}-${c}`;
      seat.className = 'seat ' + (bookedSeats.has(key) ? 'booked' : premiumRows.has(r) ? 'premium' : 'avail');
      seat.dataset.key = key;
      if (!bookedSeats.has(key)) {
        seat.addEventListener('click', () => {
          if (seat.classList.contains('selected')) {
            seat.classList.remove('selected');
            seat.classList.add(premiumRows.has(r) ? 'premium' : 'avail');
            selectedCount--;
          } else {
            seat.classList.remove('avail', 'premium');
            seat.classList.add('selected');
            selectedCount++;
          }
          if (selectedCount > 0) showToast(`${selectedCount} seat(s) selected`);
        });
      }
      seatGrid.appendChild(seat);
    }
  }

  // ---- Pod / environment badge ----
  const podBadge = document.getElementById('podBadge');
  const podId = 'pod-' + Math.random().toString(36).slice(2, 8);
  podBadge.textContent = `Served by ${podId} · ${window.location.hostname}${window.location.pathname}`;
});
