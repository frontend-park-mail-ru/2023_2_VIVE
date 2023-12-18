const CACHE_NAME = 'hunt-n-hire';

self.addEventListener('install', (evt) =>
    evt.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheName == CACHE_NAME) {
                        return caches.delete(cacheName);
                    }
                }),
            );
        }),
    ),
);

self.addEventListener('message', (event) => {
    console.log(event.data.payload);
    if (event.data.type === 'CACHE_URLS') {
        event.waitUntil(
            caches.open(CACHE_NAME)
                .then((cache) => {
                    return cache.addAll(event.data.payload);
                })
        );
    }
});

self.addEventListener('fetch', function(event) {
    console.log(event.request);
    event.respondWith(
        caches.match(event.request).then(function(cachedResponse) {
            if (cachedResponse) {
                return cachedResponse;
            }
            return fetch(event.request);
        })
    );
});

