if ('serviceWorker' in navigator) {
    window.addEventListener('load', function () {
        navigator.serviceWorker.register('/sw.js', {
            scope: '/',
        }).then((reg) => {

            const data = {
                type: 'CACHE_URLS',
                payload: [
                    window.location.pathname,
                    ...performance.getEntriesByType('resource').filter((r) => {
                        const filename = r.name.split('/').at(-1);
                        return filename != 'swload.js';
                    }).map(r => r.name),
                
                ]
            };
            reg.active.postMessage(data);
        }).catch(error => {
            console.error('SW reg failed', error);
        })
    });
}

window.addEventListener('offline', event => {
    console.log('offline!');
});
