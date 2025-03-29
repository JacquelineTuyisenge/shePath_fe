/// <reference lib="webworker" />
const CACHE_NAME = 'shepath-cache-v1'; 
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/src/main.tsx',
  '/src/assets/heroPic.svg',
  '/src/assets/heroAbout.svg',
  '/src/assets/awareness.svg',
  '/src/assets/mentorship.svg',
  './src/index.css',
  '/favicon.ico'
];

self.addEventListener("fetch", (event: any) => {
  const requestUrl = event.request.url;

  // Cache API responses 
  if (requestUrl.includes("/api/courses") || requestUrl.includes("/topics") || requestUrl.includes("/likes") || requestUrl.includes("/comments") || requestUrl.includes("/chats")) {
    event.respondWith(
      caches.open(CACHE_NAME).then((cache) => {
        return fetch(event.request)
          .then((response) => {
            // Cache the API response for future offline use
            if (response.ok) {
              cache.put(event.request, response.clone());
            }
            return response; 
          })
          .catch(() => {
            // If network fails (offline), return cached response
            return caches.match(event.request)
              .then((cachedResponse) => {
                return cachedResponse || new Response("No cached data available.");
              });
          });
      })
    );
  }

  if (STATIC_ASSETS.some((asset) => requestUrl.includes(asset))) {
    event.respondWith(
      caches.match(event.request).then((cachedResponse) => {
        return cachedResponse || fetch(event.request);
      })
    );
  }

  // Cache other resources
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request); 
    })
  );
});

// Install event - cache static assets during service worker installation
self.addEventListener('install', (event: any) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS);
    })
  );
});

// Activate event - clean up old caches during service worker activation
self.addEventListener('activate', (event: any) => {
  const cacheWhitelist = [CACHE_NAME];

  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (!cacheWhitelist.includes(cacheName)) {
            return caches.delete(cacheName); // Delete old caches
          }
        })
      );
    })
  );
});
