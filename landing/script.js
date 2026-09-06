// Nexora Home (landing) — front-end interactivity (no backend required)
document.addEventListener('DOMContentLoaded', () => {
  const podBadge = document.getElementById('podBadge');
  const podId = 'pod-' + Math.random().toString(36).slice(2, 8);
  podBadge.textContent = `Served by ${podId} · ${window.location.hostname}${window.location.pathname}`;
});
