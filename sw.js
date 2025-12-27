/* ==========================
   SERVICE WORKER - PWA REAL
   ========================== */

const CACHE_NAME = "adword-pwa-v1";

const ASSETS_TO_CACHE = [
  "./",
  "./index.html",
  "./manifest.json",
  "./sw.js",

  // Librerías externas
  "https://cdn.jsdelivr.net/npm/sweetalert2@11",
  "https://cdn.jsdelivr.net/npm/hls.js@1.4.0/dist/hls.min.js",
  "https://fonts.googleapis.com/css2?family=Orbitron:wght@700&display=swap",
  "https://fonts.googleapis.com/css2?family=VT323&display=swap",
  "https://fonts.googleapis.com/css2?family=Roboto&display=swap"
];

/* ==========================
   INSTALACIÓN
   ========================== */
self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log("📦 Cacheando recursos...");
        return cache.addAll(ASSETS_TO_CACHE);
      })
  );
  self.skipWaiting();
});

/* ==========================
   ACTIVACIÓN
   ========================== */
self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.map(key => {
          if (key !== CACHE_NAME) {
            console.log("🧹 Cache antiguo eliminado:", key);
            return caches.delete(key);
          }
        })
      )
    )
  );
  self.clients.claim();
});

/* ==========================
   FETCH (OFFLINE-FIRST)
   ========================== */
self.addEventListener("fetch", event => {

  // Solo GET
  if (event.request.method !== "GET") return;

  event.respondWith(
    caches.match(event.request)
      .then(cachedResponse => {

        // 1️⃣ Si está en cache → responde
        if (cachedResponse) {
          return cachedResponse;
        }

        // 2️⃣ Si no está → red
        return fetch(event.request)
          .then(networkResponse => {

            // Guardar en cache solo si es válido
            if (
              networkResponse &&
              networkResponse.status === 200 &&
              networkResponse.type === "basic"
            ) {
              const responseClone = networkResponse.clone();
              caches.open(CACHE_NAME)
                .then(cache => cache.put(event.request, responseClone));
            }

            return networkResponse;
          })
          .catch(() => {
            // 3️⃣ Offline total
            if (event.request.destination === "document") {
              return caches.match("./index.html");
            }
          });
      })
  );
});