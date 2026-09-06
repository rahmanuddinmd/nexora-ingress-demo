// Nexora Home (landing) — front-end interactivity (no backend required)
document.addEventListener('DOMContentLoaded', () => {

  // Smart cross-app links: when this page is opened directly as a local
  // file (double-clicked, file:// protocol), route to the sibling app
  // folders on disk. When served through Kubernetes Ingress at "/",
  // keep the root-absolute paths ("/pay", "/movies", "/travel") that the
  // Ingress rules match.
  if (location.protocol === 'file:') {
    const targets = { pay: '../app1/index.html', movies: '../app2/index.html', travel: '../app3/index.html' };
    document.querySelectorAll('[data-app-link]').forEach(a => {
      a.setAttribute('href', targets[a.dataset.appLink]);
    });
  }

  const podBadge = document.getElementById('podBadge');
  const podId = 'pod-' + Math.random().toString(36).slice(2, 8);
  podBadge.textContent = `Served by ${podId} · ${window.location.hostname || 'local file'}${window.location.pathname}`;
});
