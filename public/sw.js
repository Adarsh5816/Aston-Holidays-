// Aston Holidays Progressive Web App Service Worker
const CACHE_NAME = "aston-holidays-v1";
const STATIC_ASSETS = [
  "/",
  "/resorts",
  "/brand/emblem.png",
  "/brand/logo.png",
  "/brand/logo-web.png",
  "/manifest.json"
];

// Install: Cache critical static assets
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS).catch((err) => {
        console.warn("[SW] Cache preload warning:", err);
      });
    })
  );
  self.skipWaiting();
});

// Activate: Clean old caches and claim clients immediately
self.addEventListener("activate", (event) => {
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

// Fetch: Network first with cache fallback for dynamic content
self.addEventListener("fetch", (event) => {
  // Only handle GET requests and skip API or Chrome extension calls
  if (event.request.method !== "GET" || event.request.url.startsWith("chrome-extension") || event.request.url.includes("/api/")) {
    return;
  }

  event.respondWith(
    fetch(event.request)
      .then((networkResponse) => {
        // Cache successful responses for images and fonts
        if (
          networkResponse &&
          networkResponse.status === 200 &&
          (event.request.destination === "image" || event.request.destination === "font")
        ) {
          const clone = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
        }
        return networkResponse;
      })
      .catch(() => {
        return caches.match(event.request).then((cachedResponse) => {
          if (cachedResponse) return cachedResponse;
          if (event.request.mode === "navigate") {
            return caches.match("/");
          }
        });
      })
  );
});
