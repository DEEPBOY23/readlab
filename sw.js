// Généré par scripts/sw-build.mjs
const CACHE = 'readlab-d15826cd837e';
// Moteur OCR (≈5 Mo) : mis en cache à la première utilisation seulement, conservé entre les versions.
const OCR_CACHE = 'readlab-ocr-2';
// Transcription vocale (≈100 Mo) : idem, téléchargée à la première note vocale seulement.
const ASR_CACHE = 'readlab-asr-1'; // à incrémenter à chaque changement de version du moteur
const FILES = ["./","assets/Backup-dYXzuSEY.js","assets/Catchup-9Ruj0Qjo.js","assets/Chapters-C1CH_TaH.js","assets/Devices-RQYp8clo.js","assets/Feedback-BvtykFa5.js","assets/Fiche-DhX5fYBN.js","assets/MyFiches-BuX3nH_I.js","assets/asr.worker-Circl8xM.js","assets/db-CWZPatyx.js","assets/dexie-react-hooks-B_0_Cdgp.js","assets/esm-q73noGxA.js","assets/fiche-repo-jnHY9-7q.js","assets/index-C_3l70Uv.css","assets/index-sW2OHqBP.js","assets/jsx-runtime-BB9-612F.js","assets/rolldown-runtime-BCiCTKAo.js","assets/src-BmUdCsRu.js","assets/ui-FtWVicjQ.js","icon-180-v2.png","icon-512-v2.png","index.html","logo-64.png","manifest.webmanifest","splash-bg.webp","splash-logo.png"];
// Chaque version note sa date d'installation dans son cache (« __installe »).
self.addEventListener('install', e => e.waitUntil(caches.open(CACHE)
  .then(c => c.addAll(FILES.map(f => new Request(f, { cache: 'reload' }))).then(() => c.put('__installe', new Response(String(Date.now())))))
  .then(() => self.skipWaiting())));
// On garde la version précédente : une page encore ouverte sur l'ancienne version trouve toujours ses fichiers
// (sinon un écran chargé à la demande échouait juste après une mise à jour). Les versions plus anciennes sont effacées.
self.addEventListener('activate', e => e.waitUntil(caches.keys()
  .then(keys => Promise.all(keys.filter(n => /^readlab-[0-9a-f]{12}$/.test(n) && n !== CACHE)
    .map(n => caches.open(n).then(c => c.match('__installe')).then(r => r ? r.text() : '0').then(t => ({ n, t: Number(t) || 0 })))))
  .then(old => Promise.all(old.sort((a, b) => b.t - a.t).slice(1).map(o => caches.delete(o.n))))
  .then(() => self.clients.claim())));
self.addEventListener('fetch', e => {
  const u = new URL(e.request.url);
  if (e.request.method !== 'GET' || u.origin !== location.origin) return;
  if (u.pathname.includes('/ocr/') || u.pathname.includes('/asr/') || u.pathname.endsWith('.wasm')) {
    e.respondWith(caches.open(u.pathname.includes('/ocr/') ? OCR_CACHE : ASR_CACHE).then(c => c.match(e.request).then(r => r || fetch(e.request).then(res => { if (res.ok) c.put(e.request, res.clone()); return res; }))));
    return;
  }
  // D'abord la version actuelle, puis la précédente (fichiers d'une page restée ouverte), enfin le réseau.
  const fromCaches = req => caches.open(CACHE).then(c => c.match(req, { ignoreSearch: true }))
    .then(r => r || caches.match(req, { ignoreSearch: true }));
  // Navigation : la page la plus récente du réseau (elle correspond toujours aux fichiers publiés) ;
  // hors ligne ou réseau trop lent (2,5 s), la page de la version en cache. Routes par #.
  if (e.request.mode === 'navigate') {
    const net = fetch(e.request, { cache: 'no-cache' }).then(r => (r.ok ? r : Promise.reject(r)));
    const slow = new Promise(res => setTimeout(res, 2500)).then(() => fromCaches('./'));
    e.respondWith(Promise.any([net, slow.then(r => r || Promise.reject())]).catch(() => fromCaches('./')).then(r => r || fetch(e.request)));
    return;
  }
  e.respondWith(fromCaches(e.request).then(r => r || fetch(e.request)));
});
