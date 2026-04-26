var staticCacheName = "pwa-v" + new Date().getTime();
var filesToCache = [
    '/images/logo/logo.png',
];

// Cache on install
self.addEventListener("install", event => {
    self.skipWaiting();
    event.waitUntil(
        caches.open(staticCacheName)
            .then(cache => {
                return cache.addAll(filesToCache).catch(err => {
                    console.warn('ServiceWorker: some files failed to cache', err);
                });
            })
    )
});

// Clear old caches on activate
self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames
                    .filter(cacheName => (cacheName.startsWith("pwa-")))
                    .filter(cacheName => (cacheName !== staticCacheName))
                    .map(cacheName => caches.delete(cacheName))
            );
        })
    );
});

// Network-first strategy: try network, fallback to cache
self.addEventListener("fetch", event => {
    // Skip non-GET requests (POST uploads, etc.)
    if (event.request.method !== 'GET') return;

    event.respondWith(
        fetch(event.request)
            .then(response => {
                // Cache successful responses for offline use
                if (response.status === 200) {
                    const responseClone = response.clone();
                    caches.open(staticCacheName).then(cache => {
                        cache.put(event.request, responseClone);
                    });
                }
                return response;
            })
            .catch(() => {
                return caches.match(event.request).then(response => {
                    return response || new Response('Connection failed', { status: 503 });
                });
            })
    )
});