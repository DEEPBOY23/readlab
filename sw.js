// Généré par scripts/sw-build.mjs
const CACHE = 'readlab-b4bd6abd78c9';
// Moteur OCR (≈5 Mo) : mis en cache à la première utilisation seulement, conservé entre les versions.
const OCR_CACHE = 'readlab-ocr-2';
// Transcription vocale (≈100 Mo) : idem, téléchargée à la première note vocale seulement.
const ASR_CACHE = 'readlab-asr-1'; // à incrémenter à chaque changement de version du moteur
const FILES = ["./","assets/Backup-d11kfIKj.js","assets/Catchup-CPWQkgXT.js","assets/Chapters-DM4cDR2i.js","assets/Devices-GFv3XedK.js","assets/Feedback-C2yU0ZEI.js","assets/Fiche-Bvt_kwEk.js","assets/MyFiches-rjXlN5SY.js","assets/asr.worker-Circl8xM.js","assets/db-D1qYuD0T.js","assets/esm-q73noGxA.js","assets/fiche-repo-CLzno0sK.js","assets/index-DXcNTUlP.js","assets/index-JkT7k7G_.css","assets/rolldown-runtime-BCiCTKAo.js","assets/src-BmUdCsRu.js","icon-180-v2.png","icon-512-v2.png","index.html","logo-64.png","manifest.webmanifest","splash-logo.png","splash-noise.png"];
self.addEventListener('install', e => e.waitUntil(caches.open(CACHE).then(c => c.addAll(FILES.map(f => new Request(f, { cache: 'reload' })))).then(() => self.skipWaiting())));
self.addEventListener('activate', e => e.waitUntil(caches.keys()
  .then(k => Promise.all(k.filter(n => n.startsWith('readlab-') && n !== CACHE && n !== OCR_CACHE && n !== ASR_CACHE).map(n => caches.delete(n))))
  .then(() => self.clients.claim())));
self.addEventListener('fetch', e => {
  const u = new URL(e.request.url);
  if (e.request.method !== 'GET' || u.origin !== location.origin) return;
  if (u.pathname.includes('/ocr/') || u.pathname.includes('/asr/') || u.pathname.endsWith('.wasm')) {
    e.respondWith(caches.open(u.pathname.includes('/ocr/') ? OCR_CACHE : ASR_CACHE).then(c => c.match(e.request).then(r => r || fetch(e.request).then(res => { if (res.ok) c.put(e.request, res.clone()); return res; }))));
    return;
  }
  // Navigation : toujours l'app en cache (fonctionne hors ligne, routes par #).
  if (e.request.mode === 'navigate') { e.respondWith(caches.match('./').then(r => r || fetch(e.request))); return; }
  e.respondWith(caches.match(e.request, { ignoreSearch: true }).then(r => r || fetch(e.request)));
});
