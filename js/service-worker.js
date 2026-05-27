const cacheName = 're4-bingo-v6';
const filesToCache = [
  './',
  './index.html',
  './styles.css',
  './js/challenges.js',
  './js/script.js',
  './manifest.json',
  './favicon.ico',
  './fonts/Virgula Vulgaris Bold.ttf'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(cacheName).then(cache => cache.addAll(filesToCache))
  );
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== cacheName).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(r => r || fetch(event.request))
  );
});
