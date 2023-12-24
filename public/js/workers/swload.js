
if ('serviceWorker' in navigator) {
    window.addEventListener('load', async () => {
        try {
            const reg = await navigator.serviceWorker.register('/sw.js', { scope: '/' });
            // const data = {
            //     type: 'CACHE_URLS',
            //     payload: [
            //         // '/',
            //         window.location.origin + window.location.pathname,
            //         ...performance.getEntriesByType('resource').map(r => r.name),
            //     ]
            // };
            // reg.active.postMessage(data);
        } catch (err) {
            console.error('SW reg failed', err);
        }
    });

}
