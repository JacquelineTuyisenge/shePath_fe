/// <reference lib="webworker" />
const CACHE_NAME = "pwa-cache-v1";
const urlsToCache = [
  "/",
  "/index.html",
  "/courses",
  "/assets/Hero-bg.png",
];

self.addEventListener("install", (event: any) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(urlsToCache);
    })
  );
});

self.addEventListener("fetch", (event: any) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});

self.addEventListener("fetch", (event: any) => {
    if (event.request.url.includes("/api/courses")) {
      event.respondWith(
        caches.open(CACHE_NAME).then((cache) => {
          return fetch(event.request).then((response) => {
            cache.put(event.request, response.clone());
            return response;
          }).catch(() => caches.match(event.request));
        })
      );
    }
  });
  