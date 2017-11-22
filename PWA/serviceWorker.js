const cacheName = 'pwa-starter-kit';
const cacheVersion = `${cacheName}::1.0.2`;

//const networkFiles = [];
let installCompleted = false;

self.addEventListener('install', event => {

    console.log('[pwa install]');


    event.waitUntil(
        caches.open(cacheVersion)
            .then((cache) => {

                return fetch('to-cache.json').then((response)=> {
                    return response.json();
                }).then((files)=> {
                    console.log('[install] Adding files from JSON file: ', files);

                    files.forEach((file)=>{
                        try{
                            cache.add(file);
                            console.log('Cached file '+ file);
                        }
                        catch (err){
                            console.error(err);
                        }
                    });

                    return cache.addAll([]);
                });
            })
    );

});

self.addEventListener('activate', event => {

    console.log('[pwa activate]');

    self.clients.matchAll({
        includeUncontrolled: true
    }).then(function(clients) {
        clients.forEach(function(client) {
            if(!installCompleted)
                client.postMessage({
                    "command": "broadcastOnRequest",
                    "message": "Could not cache all files as needed."
                });
        })
    });

    event.waitUntil(
        caches.keys().then(keys =>
            Promise.all(
                keys.filter(key => key.indexOf(cacheName) === 0 && key !== cacheVersion)
                    .map(key => caches.delete(key))
            )
        )
    );

    return self.clients.claimClients();

});


self.addEventListener('fetch', event => {

    debugger;

    /*
    if (networkFiles.filter(item => event.request.url.match(item)).length) {

        console.log('[network fetch]', event.request.url);

        event.respondWith(
            caches.match(event.request)
                .then(response => response || fetch(event.request))
        );

    } else {
*/
        console.log('[pwa fetch]', event.request.url);

        event.respondWith(
            caches.match(event.request)
                .then(response => {

                    caches.open(cacheVersion).then(cache => cache.add(event.request.url));

                    return response || fetch(event.request);

                })
        );

    //}

});

