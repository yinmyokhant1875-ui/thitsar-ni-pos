const CACHE_NAME = 'thitsar-ni-pos-v1';
const ASSETS_TO_CACHE = [
  './index.html',
  './manifest.json',
  './icon-512.png',
  'https://cdn.tailwindcss.com',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css',
  'https://fonts.googleapis.com/css2?family=Pyidaungsu:wght@400;700&display=swap'
];

// Install Event - Caches core assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
  self.skipWaiting();
});

// Activate Event - Clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Fetch Event - Serve from cache when offline, fallback to network
self.addEventListener('fetch', (event) => {
  // Skip Google Apps Script POST/GET API calls from caching so they fetch live data
  if (event.request.url.includes('script.google.com')) {
    return;
  }

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      return cachedResponse || fetch(event.request).catch(() => {
        // Optional fallback for HTML pages when completely offline
        if (event.request.mode === 'navigate') {
          return caches.match('./index.html');
        }
      });
    })
  );
});
