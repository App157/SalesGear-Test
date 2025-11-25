const CACHE_NAME = 'salesgear-cache-v1';
const FILES_TO_CACHE = [
  './',
  './index.html',
  './style.css',
  './sw.js',
  './manifest.json',
  './icon-512.png',
  './icon-192.png'
];

// Install: cache all files
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      console.log('Caching app shell...');
      return cache.addAll(FILES_TO_CACHE);
    })
  );
  self.skipWaiting();
});

// Activate: clean old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then(keys => Promise.all(
      keys.map(key => {
        if (key !== CACHE_NAME) {
          console.log('Removing old cache', key);
          return caches.delete(key);
        }
      })
    ))
  );
  self.clients.claim();
});

// Fetch: serve cached files when offline
self.addEventListener('fetch', (event) => {
  event.respondWith(
    fetch(event.request)
      .then(response => {
        // Optionally update cache with new response
        const responseClone = response.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(event.request, responseClone));
        return response;
      })
      .catch(() => caches.match(event.request)) // fallback to cache if offline
  );
});