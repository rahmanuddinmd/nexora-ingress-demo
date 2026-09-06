// Nexora Pay — front-end interactivity (no backend required)
document.addEventListener('DOMContentLoaded', () => {

  // ---- User dropdown ----
  const userChip = document.getElementById('userChip');
  const dropdown = document.getElementById('userDropdown');
  userChip.addEventListener('click', (e) => {
    e.stopPropagation();
    dropdown.classList.toggle('open');
  });
  document.addEventListener('click', () => dropdown.classList.remove('open'));

  // ---- Toast helper ----
  const toast = document.getElementById('toast');
  let toastTimer;
  function showToast(msg) {
    toast.textContent = msg;
    toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('show'), 2200);
  }

  // ---- Hero quick actions ----
  document.querySelectorAll('[data-action]').forEach(btn => {
    btn.addEventListener('click', () => {
      const action = btn.dataset.action;
      const messages = {
        add: 'Redirecting to Add Money flow…',
        send: 'Opening Send Money to contacts…',
        scan: 'Launching camera for Scan & Pay…',
        request: 'Opening Request Money form…',
      };
      showToast(messages[action] || 'Action triggered');
    });
  });

  // ---- Service cards ----
  document.querySelectorAll('.service-card').forEach(card => {
    card.addEventListener('click', () => {
      const label = card.textContent.trim();
      showToast(`Opening ${label}…`);
    });
  });

  // ---- Animate wallet balance count-up ----
  const balanceEl = document.getElementById('balanceValue');
  const target = 12480.50;
  let current = 0;
  const duration = 900;
  const start = performance.now();
  function tick(now) {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    current = target * eased;
    balanceEl.textContent = current.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    if (progress < 1) requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);

  // ---- Pod / environment badge (purely cosmetic, demonstrates per-pod identity) ----
  const podBadge = document.getElementById('podBadge');
  const podId = 'pod-' + Math.random().toString(36).slice(2, 8);
  podBadge.textContent = `Served by ${podId} · ${window.location.hostname}${window.location.pathname}`;
});
