const S_CACHE_NAME = 's-hh-cache-v1';
const D_CACHE_NAME = 'd-hh-cache-v1';

const BACKEND_SERVER_URL = 'https://hunt-n-hire.ru/api/';

self.addEventListener('install', async (event) => {
    // // // console.log('sw install!', event);

});

self.addEventListener('activate', (event) => {
    // // // console.log('sw activate!', event);
    event.waitUntil(
        caches.keys().then((keyList) => {
            return Promise.all(

                keyList
                    // .filter(key => key != S_CACHE_NAME && key != D_CACHE_NAME)
                    .map((key) => {
                        //очищаем весь ненужный кеш
                        return caches.delete(key);
                    }),
            );
        }),
    );
});

// self.addEventListener('message', (event) => {
//     // // console.log('sw message!', event.data.payload);
//     if (event.data.type == 'CACHE_URLS') {
//         event.waitUntil(
//             Promise.all([
//                 caches.open(S_CACHE_NAME).then(cache => {
//                     return cache.addAll(
//                         event.data.payload.filter(url => {

//                             return url.indexOf(BACKEND_SERVER_URL) != 0
//                         })
//                     );
//                 }),
//                 caches.open(D_CACHE_NAME).then(cache => {
//                     return cache.addAll(
//                         event.data.payload.filter(url => {
//                             return url.indexOf(BACKEND_SERVER_URL) == 0
//                         })
//                     );
//                 })
//             ])
//         )
//     }
// });

self.addEventListener('fetch', function (event) {
    // // // console.log('sw fetch!', event.request.url);

    const { request } = event
    const url = new URL(request.url);

    if (request.method == 'GET') {
        const is_api = url.href.indexOf(BACKEND_SERVER_URL) == 0;
        if (!is_api) {
            event.respondWith(sNetFirst(request));
        } else {
            event.respondWith(dNetFirst(request));
        }
    } else {
        event.respondWith(fetch(request));
    }
});


async function sCacheFirst(request) {
    const cache = await caches.open(S_CACHE_NAME);
    const cached = await cache.match(request);
    if (cached) {
        return cached;
    } else {
        const resp = await fetch(request);
        await cache.put(request, resp.clone());
        return resp;
    }
}

async function dNetFirst(request) {
    return await netFirst(request, 'd');
}

async function sNetFirst(request) {
    return await netFirst(request, 's');
}

async function netFirst(request, type) {
    const cache = await caches.open(type == 's' ? S_CACHE_NAME : D_CACHE_NAME);
    try {
        const resp = await fetch(request);
        await cache.put(request, resp.clone());
        return resp;
    } catch (err) {
        const cached = await cache.match(request);
        if (cached) {
            return cached;
        } else {
            throw err;
        }
    }
}
