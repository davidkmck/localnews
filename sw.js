const CACHE_NAME = 'localnews-v1';
const ASSETS = [
  './',
  './index.html',
  './feed.xml',
  './manifest.json',
  './icon-192.png',
  './icon-512.png'
];

// Install: Cache initial assets
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS))
  );
});

// Fetch: Network first, then fallback to cache if offline
self.addEventListener('fetch', event => {
  event.respondWith(
    fetch(event.request)
      .then(response => {
        // If network fetch is successful, update the cache with the fresh response
        if (event.request.method === 'GET' && response.status === 200) {
          const responseClone = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(event.request, responseClone));
        }
        return response;
      })
      .catch(() => caches.match(event.request)) // Fallback to cache
  );
});
