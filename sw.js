const cacheName = 'salesgear-v1';
const assetsToCache = [
  './',
  './index.html',
  './style.css',
  './script.js',
  './dexie.js',
  './manifest.json',
  './service-worker.js',
  './icon-192.png',
  './icon-512.png'
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(cacheName).then(cache => {
      return cache.addAll(assetsToCache);
    })
  );
  self.skipWaiting(); // Force the waiting service worker to become active
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.map(key => {
          if (key !== cacheName) return caches.delete(key);
        })
      )
    )
  );
  self.clients.claim(); // Take control of all clients immediately
});

self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request).then(response => response || fetch(e.request))
  );
});