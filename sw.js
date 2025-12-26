const CACHE_NAME = 'cf-pwa-v1';

const APP_SHELL = [
  './',
  './index.html',
  './manifest.json'
];

// Instalación
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      console.log('[SW] Cacheando app shell');
      return cache.addAll(APP_SHELL);
    })
  );
  self.skipWaiting();
});

// Activación
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.map(key => {
          if (key !== CACHE_NAME) {
            console.log('[SW] Borrando cache viejo', key);
            return caches.delete(key);
          }
        })
      )
    )
  );
  self.clients.claim();
});

// Fetch
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return (
        response ||
        fetch(event.request).then(fetchRes => {
          return caches.open(CACHE_NAME).then(cache => {
            cache.put(event.request, fetchRes.clone());
            return fetchRes;
          });
        }).catch(() => {
          // fallback offline
          if (event.request.mode === 'navigate') {
            return caches.match('./index.html');
          }
        })
      );
    })
  );
});
