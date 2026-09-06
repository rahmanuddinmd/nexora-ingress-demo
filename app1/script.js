// Nexora Pay — front-end interactivity (no backend required)
document.addEventListener('DOMContentLoaded', () => {

  // ---- Smart cross-app links: work both when double-clicked as a local
  // file (file://) and when served through Kubernetes Ingress at "/" ----
  if (location.protocol === 'file:') {
    document.querySelectorAll('[data-home-link]').forEach(a => {
      a.setAttribute('href', '../landing/index.html');
    });
  }

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
    toastTimer = setTimeout(() => toast.classList.remove('show'), 2400);
  }

  // ---- Live wallet state ----
  let balance = 12480.50;
  let spending = 8420;
  let cashback = 312;
  let points = 1240;
  const balanceEl = document.getElementById('balanceValue');
  const statSpending = document.getElementById('statSpending');
  const statCashback = document.getElementById('statCashback');
  const statPoints = document.getElementById('statPoints');
  const txList = document.getElementById('txList');

  function formatINR(n) {
    return n.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }
  function renderBalance() {
    balanceEl.textContent = formatINR(balance);
  }
  function addTransaction(label, amount) {
    const row = document.createElement('div');
    row.className = 'tx-row tx-row-new';
    row.innerHTML = `
      <span class="tx-icon"><svg width="18" height="18"><use href="#i-check"/></svg></span>
      <div class="tx-info"><strong>${label}</strong><small>Just now</small></div>
      <div class="tx-meta"><strong>₹${amount.toLocaleString('en-IN')}</strong><small class="ok">Successful</small></div>
    `;
    txList.prepend(row);
    requestAnimationFrame(() => row.classList.add('show'));
  }

  // ---- Payment modal ----
  const overlay = document.getElementById('modalOverlay');
  const modalTitle = document.getElementById('modalTitle');
  const modalSub = document.getElementById('modalSub');
  const modalAmount = document.getElementById('modalAmount');
  const modalSubmit = document.getElementById('modalSubmit');
  const modalSuccessText = document.getElementById('modalSuccessText');
  const modalClose = document.getElementById('modalClose');
  let pendingLabel = 'Payment';

  function openModal(label, sub, suggested) {
    pendingLabel = label;
    modalTitle.textContent = label.startsWith('Pay ') || label === 'Add Money' || label === 'Send Money' || label === 'Request Money' ? label : `Pay ${label}`;
    modalSub.textContent = sub || 'Enter an amount to continue. This is a demo — no real payment is made.';
    modalAmount.value = suggested || '';
    overlay.classList.remove('success');
    overlay.classList.add('open');
    setTimeout(() => modalAmount.focus(), 150);
  }
  function closeModal() {
    overlay.classList.remove('open');
  }
  modalClose.addEventListener('click', closeModal);
  overlay.addEventListener('click', (e) => { if (e.target === overlay) closeModal(); });

  modalSubmit.addEventListener('click', () => {
    const amount = parseFloat(modalAmount.value);
    if (!amount || amount <= 0) {
      modalAmount.focus();
      modalAmount.style.borderColor = '#ff5b7c';
      setTimeout(() => { modalAmount.style.borderColor = ''; }, 900);
      return;
    }
    const isCredit = pendingLabel === 'Add Money' || pendingLabel === 'Request Money';
    if (isCredit) {
      balance += amount;
    } else {
      balance = Math.max(0, balance - amount);
      spending += amount;
      const earned = Math.round(amount * 0.02);
      cashback += earned;
      points += Math.round(amount / 10);
      statSpending.textContent = '₹' + spending.toLocaleString('en-IN');
      statCashback.textContent = '₹' + cashback.toLocaleString('en-IN');
      statPoints.textContent = points.toLocaleString('en-IN');
      addTransaction(pendingLabel === 'Send Money' ? 'Sent Money' : pendingLabel, amount);
    }
    renderBalance();
    modalSuccessText.textContent = `₹${amount.toLocaleString('en-IN')} ${isCredit ? 'added to your wallet' : 'paid'} successfully.`;
    overlay.classList.add('success');
    setTimeout(closeModal, 1600);
  });

  // ---- Hero quick actions ----
  document.querySelectorAll('[data-action]').forEach(btn => {
    btn.addEventListener('click', () => {
      const action = btn.dataset.action;
      if (action === 'add') openModal('Add Money', 'Top up your Nexora wallet instantly.', 1000);
      else if (action === 'send') openModal('Send Money', 'Send money to any Nexora contact.', 500);
      else if (action === 'request') openModal('Request Money', 'Request money from a contact.', 500);
      else if (action === 'scan') showToast('Opening camera for Scan & Pay… (demo)');
      else if (action === 'more') showToast('Loading more services…');
    });
  });

  // ---- Service cards open the payment modal pre-filled ----
  document.querySelectorAll('.service-card[data-service]').forEach(card => {
    card.addEventListener('click', () => {
      const service = card.dataset.service;
      const suggest = card.dataset.suggest;
      openModal(service, `Pay your ${service.toLowerCase()} securely with Nexora Pay.`, suggest);
    });
  });

  // ---- Animate wallet balance count-up on load ----
  const target = balance;
  let current = 0;
  const duration = 900;
  const start = performance.now();
  function tick(now) {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    current = target * eased;
    balanceEl.textContent = formatINR(current);
    if (progress < 1) requestAnimationFrame(tick);
    else renderBalance();
  }
  requestAnimationFrame(tick);

  // ---- Pod / environment badge (purely cosmetic, demonstrates per-pod identity) ----
  const podBadge = document.getElementById('podBadge');
  const podId = 'pod-' + Math.random().toString(36).slice(2, 8);
  podBadge.textContent = `Served by ${podId} · ${window.location.hostname || 'local file'}${window.location.pathname}`;
});
