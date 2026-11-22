// Généré par scripts/sw-build.mjs
const CACHE = 'readlab-7a27ec3d2fcf';
// Moteur OCR (≈5 Mo) : mis en cache à la première utilisation seulement, conservé entre les versions.
const OCR_CACHE = 'readlab-ocr-2';
// Transcription vocale (≈100 Mo) : idem, téléchargée à la première note vocale seulement.
const ASR_CACHE = 'readlab-asr-1'; // à incrémenter à chaque changement de version du moteur
const FILES = ["./","assets/Backup-BVCpG-k8.js","assets/Catchup-DUt9iRSN.js","assets/Chapters-CBGAiF_4.js","assets/Devices-Dltr_FOA.js","assets/Feedback-Bs7SjIaf.js","assets/Fiche-DnsmopYJ.js","assets/MyFiches-C4fkbcOC.js","assets/asr.worker-Circl8xM.js","assets/db-D1qYuD0T.js","assets/esm-q73noGxA.js","assets/fiche-repo-B06qUjj4.js","assets/index-JkT7k7G_.css","assets/index-s5r0-cMY.js","assets/rolldown-runtime-BCiCTKAo.js","assets/src-BmUdCsRu.js","icon-180.png","icon-512.png","index.html","logo-64.png","manifest.webmanifest","splash-bg.webp","splash-logo.png"];
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
