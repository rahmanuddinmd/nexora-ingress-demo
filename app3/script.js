// Nexora Travel — front-end interactivity (no backend required)
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

  // ---- Tab-driven search panel ----
  const TAB_DATA = {
    flights: {
      cta: 'SEARCH FLIGHTS',
      fields: [
        { icon: 'i-pin', label: 'From', value: 'Bengaluru', sub: 'BLR · Kempegowda Intl' },
        { swap: true },
        { icon: 'i-pin', label: 'To', value: 'Dubai', sub: 'DXB · Dubai Intl' },
        { icon: 'i-calendar', label: 'Departure', value: '12 Sep', sub: 'Saturday' },
        { icon: 'i-calendar', label: 'Return', value: '19 Sep', sub: 'Saturday' },
        { icon: 'i-users', label: 'Travellers', value: '2 Adults', sub: 'Economy' },
      ],
    },
    hotels: {
      cta: 'SEARCH HOTELS',
      fields: [
        { icon: 'i-pin', label: 'City', value: 'Goa', sub: 'India' },
        { icon: 'i-calendar', label: 'Check-in', value: '14 Sep', sub: 'Saturday' },
        { icon: 'i-calendar', label: 'Check-out', value: '17 Sep', sub: 'Tuesday' },
        { icon: 'i-users', label: 'Guests', value: '2 Adults', sub: '1 Room' },
      ],
    },
    trains: {
      cta: 'SEARCH TRAINS',
      fields: [
        { icon: 'i-pin', label: 'From', value: 'Hyderabad', sub: 'HYB' },
        { swap: true },
        { icon: 'i-pin', label: 'To', value: 'Bengaluru', sub: 'SBC' },
        { icon: 'i-calendar', label: 'Date', value: '15 Sep', sub: 'Sunday' },
        { icon: 'i-users', label: 'Travellers', value: '1 Adult', sub: 'Sleeper' },
      ],
    },
    buses: {
      cta: 'SEARCH BUSES',
      fields: [
        { icon: 'i-pin', label: 'From', value: 'Hyderabad', sub: 'Bus Stand' },
        { swap: true },
        { icon: 'i-pin', label: 'To', value: 'Vijayawada', sub: 'Bus Stand' },
        { icon: 'i-calendar', label: 'Date', value: '13 Sep', sub: 'Sunday' },
        { icon: 'i-users', label: 'Travellers', value: '1 Adult', sub: 'AC Sleeper' },
      ],
    },
    cabs: {
      cta: 'SEARCH CABS',
      fields: [
        { icon: 'i-pin', label: 'Pickup', value: 'Home', sub: 'Current location' },
        { icon: 'i-pin', label: 'Drop', value: 'Airport', sub: 'RGIA Terminal' },
        { icon: 'i-calendar', label: 'Date', value: 'Today', sub: '6 Sep' },
        { icon: 'i-users', label: 'Time', value: '9:30 PM', sub: 'Sedan' },
      ],
    },
  };

  const fieldsEl = document.getElementById('fields');

  function renderFields(tabKey) {
    const data = TAB_DATA[tabKey];
    fieldsEl.innerHTML = data.fields.map(f => {
      if (f.swap) return `<button class="swap-btn" aria-label="Swap">⇄</button>`;
      return `
        <div class="field">
          <label><svg class="field-icon" width="12" height="12"><use href="#${f.icon}"/></svg> ${f.label}</label>
          <strong>${f.value}</strong>
          <span>${f.sub}</span>
        </div>`;
    }).join('') + `<button class="btn btn-primary" id="searchBtn">${data.cta}</button>`;

    document.getElementById('searchBtn').addEventListener('click', () => runSearch(tabKey));
  }

  document.querySelectorAll('.tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      renderFields(tab.dataset.tab);
    });
  });

  renderFields('flights');

  // ---- Search modal (simulated results) ----
  const overlay = document.getElementById('modalOverlay');
  const modalTitle = document.getElementById('modalTitle');
  const modalSub = document.getElementById('modalSub');
  const modalClose = document.getElementById('modalClose');
  const successTitle = document.getElementById('modalSuccessTitle');
  const successText = document.getElementById('modalSuccessText');

  const RESULTS = {
    flights: { title: '12 flights found', text: 'Best fare: ₹12,499 · Bengaluru → Dubai' },
    hotels: { title: '48 hotels found', text: 'Best price: ₹4,600/night · Goa' },
    trains: { title: '6 trains found', text: 'Best fare: ₹640 · Hyderabad → Bengaluru' },
    buses: { title: '19 buses found', text: 'Best fare: ₹520 · Hyderabad → Vijayawada' },
    cabs: { title: '4 cabs available', text: 'Sedan arriving in 6 minutes' },
  };

  function runSearch(tabKey) {
    modalTitle.textContent = `Searching ${tabKey[0].toUpperCase()}${tabKey.slice(1)}`;
    modalSub.textContent = 'Finding the best options for you…';
    overlay.classList.remove('success');
    overlay.classList.add('open');
    setTimeout(() => {
      const result = RESULTS[tabKey];
      successTitle.textContent = result.title;
      successText.textContent = result.text;
      overlay.classList.add('success');
    }, 1100);
  }
  modalClose.addEventListener('click', () => overlay.classList.remove('open'));
  overlay.addEventListener('click', (e) => { if (e.target === overlay) overlay.classList.remove('open'); });

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
  podBadge.textContent = `Served by ${podId} · ${window.location.hostname || 'local file'}${window.location.pathname}`;
});
