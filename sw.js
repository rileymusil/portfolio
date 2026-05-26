/* Riley Musil — Service Worker (required for PWA install prompt) */
const CACHE = 'rileymusil-v1';

/* Cache core pages on install */
self.addEventListener('install', function(e) {
    e.waitUntil(
        caches.open(CACHE).then(function(cache) {
            return cache.addAll([
                '/index.html',
                '/about.html',
                '/contact.html',
                '/video.html',
                '/photography.html'
            ]).catch(function() {
                /* Silently fail if some pages aren't reachable yet */
            });
        })
    );
    self.skipWaiting();
});

/* Activate: clean up old caches */
self.addEventListener('activate', function(e) {
    e.waitUntil(
        caches.keys().then(function(keys) {
            return Promise.all(
                keys.filter(function(k) { return k !== CACHE; })
                    .map(function(k) { return caches.delete(k); })
            );
        })
    );
    self.clients.claim();
});

/* Fetch: network-first, fall back to cache */
self.addEventListener('fetch', function(e) {
    if (e.request.method !== 'GET') return;
    e.respondWith(
        fetch(e.request).catch(function() {
            return caches.match(e.request);
        })
    );
});
