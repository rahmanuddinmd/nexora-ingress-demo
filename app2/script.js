// Nexora Movies — front-end interactivity (no backend required)
document.addEventListener('DOMContentLoaded', () => {

  if (location.protocol === 'file:') {
    document.querySelectorAll('[data-home-link]').forEach(a => a.setAttribute('href', '../landing/index.html'));
  }

  const toast = document.getElementById('toast');
  let toastTimer;
  function showToast(msg) {
    toast.textContent = msg;
    toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('show'), 2200);
  }

  const nowBooking = document.getElementById('nowBooking');
  let currentMovie = 'The Last Voyage';
  let currentShowtime = '05:15 PM';

  // ---- Book buttons on movie cards / hero ----
  document.querySelectorAll('.btn-book, .btn-glow').forEach(btn => {
    btn.addEventListener('click', () => {
      const card = btn.closest('.movie-card');
      const title = card ? card.querySelector('h3').textContent : 'The Last Voyage';
      currentMovie = title;
      nowBooking.textContent = `Booking: ${title}`;
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
      currentShowtime = pill.firstChild.textContent.trim();
      showToast(`Showtime ${currentShowtime} selected`);
    });
  });

  // ---- Generate seat grid ----
  const seatGrid = document.getElementById('seatGrid');
  const seatSummary = document.getElementById('seatSummary');
  const confirmBtn = document.getElementById('confirmBookingBtn');
  const rows = 6, cols = 12;
  const bookedSeats = new Set(['2-4','2-5','3-8','4-1','5-10','5-11']);
  const premiumRows = new Set([0, 1]);
  const rowLetters = 'ABCDEF';
  let selectedSeats = [];

  function updateSummary() {
    if (selectedSeats.length === 0) {
      seatSummary.textContent = 'Select seats to continue';
      confirmBtn.disabled = true;
    } else {
      seatSummary.textContent = `${selectedSeats.length} seat(s) selected: ${selectedSeats.join(', ')}`;
      confirmBtn.disabled = false;
    }
  }

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const seat = document.createElement('div');
      const key = `${r}-${c}`;
      const seatCode = `${rowLetters[r]}${c + 1}`;
      seat.className = 'seat ' + (bookedSeats.has(key) ? 'booked' : premiumRows.has(r) ? 'premium' : 'avail');
      seat.dataset.key = key;
      seat.dataset.code = seatCode;
      seat.title = seatCode;
      if (!bookedSeats.has(key)) {
        seat.addEventListener('click', () => {
          if (seat.classList.contains('selected')) {
            seat.classList.remove('selected');
            seat.classList.add(premiumRows.has(r) ? 'premium' : 'avail');
            selectedSeats = selectedSeats.filter(s => s !== seatCode);
          } else {
            seat.classList.remove('avail', 'premium');
            seat.classList.add('selected');
            selectedSeats.push(seatCode);
          }
          updateSummary();
        });
      }
      seatGrid.appendChild(seat);
    }
  }
  updateSummary();

  // ---- Confirm booking -> updates My Tickets ----
  const ticketCard = document.getElementById('ticketCard');
  const ticketMovie = document.getElementById('ticketMovie');
  const ticketDate = document.getElementById('ticketDate');
  const ticketTime = document.getElementById('ticketTime');
  const ticketSeat = document.getElementById('ticketSeat');

  confirmBtn.addEventListener('click', () => {
    if (selectedSeats.length === 0) return;
    ticketMovie.textContent = currentMovie;
    ticketTime.textContent = currentShowtime;
    ticketSeat.textContent = selectedSeats.join(', ');
    ticketDate.textContent = new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short' });
    ticketCard.classList.remove('ticket-flash');
    void ticketCard.offsetWidth; // restart animation
    ticketCard.classList.add('ticket-flash');
    ticketCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
    showToast(`Booking confirmed for ${currentMovie} — ${selectedSeats.length} seat(s)`);

    // reset selection state for a fresh demo run
    document.querySelectorAll('.seat.selected').forEach(s => {
      const r = parseInt(s.dataset.key.split('-')[0], 10);
      s.classList.remove('selected');
      s.classList.add(premiumRows.has(r) ? 'premium' : 'avail');
    });
    selectedSeats = [];
    updateSummary();
  });

  // ---- Pod / environment badge ----
  const podBadge = document.getElementById('podBadge');
  const podId = 'pod-' + Math.random().toString(36).slice(2, 8);
  podBadge.textContent = `Served by ${podId} · ${window.location.hostname || 'local file'}${window.location.pathname}`;
});
