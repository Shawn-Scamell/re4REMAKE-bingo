const cacheName = 're4-bingo-v2';
const filesToCache = [
  './',
  './index.html',
  './styles.css',
  './js/challenges.js',
  './js/script.js',
  './manifest.json',
  './favicon.ico'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(cacheName).then(cache => cache.addAll(filesToCache))
  );
});

self.skipWaiting();
self.addEventListener('activate', () => self.clients.claim());

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(r => r || fetch(event.request))
  );
});