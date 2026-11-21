// Généré par scripts/sw-build.mjs
const CACHE = 'readlab-3f0063c88fc2';
const FILES = ["./","assets/index-CbWO07B0.js","assets/index-DN11SH6K.css","icon-180.png","icon-512.png","index.html","manifest.webmanifest"];
self.addEventListener('install', e => e.waitUntil(caches.open(CACHE).then(c => c.addAll(FILES)).then(() => self.skipWaiting())));
self.addEventListener('activate', e => e.waitUntil(caches.keys()
  .then(k => Promise.all(k.filter(n => n.startsWith('readlab-') && n !== CACHE).map(n => caches.delete(n))))
  .then(() => self.clients.claim())));
self.addEventListener('fetch', e => {
  const u = new URL(e.request.url);
  if (e.request.method !== 'GET' || u.origin !== location.origin) return;
  // Navigation : toujours l'app en cache (fonctionne hors ligne, routes par #).
  if (e.request.mode === 'navigate') { e.respondWith(caches.match('./').then(r => r || fetch(e.request))); return; }
  e.respondWith(caches.match(e.request, { ignoreSearch: true }).then(r => r || fetch(e.request)));
});
