const CACHE_NAME = 'lumina-v2-clear';

self.addEventListener('install', (event) => {
  self.skipWaiting(); // Force the new service worker to activate immediately
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      // Delete ALL old caches to un-brick the site
      Promise.all(keys.map((key) => caches.delete(key)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  // Pass-through all requests directly to the network.
  // This bypasses the cache entirely to ensure the user gets the latest React bundles.
});
