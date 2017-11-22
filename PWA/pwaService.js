importScripts('clientManager.js');

const LOG_TAG = '##pwaService :';
const CANNOT_OPEN_CACHE = `Could not open the cache on browser`;
const CANNOT_FETCH_PARSE = `Could fetch or parse the list of files to cache`;
const CANNOT_CACHE_ALL_FILES = `Cloud not cache all needed files to fully work offline: maximum storage quota exceed.`;
const CACHED_FILE = 'Cached file ';

const QUERY = new URL(location).searchParams;
const ID = QUERY.get('id');
const CACHE_NAME = QUERY.get('cacheName');
const CACHE_LIST_SOURCE = QUERY.get('filesToCacheList');

const clientMng = new ClientManager(ID);


//Installs the worker and puts in cache all
//files listed in the cache list. It also
//informs the client about the cache inclusion
//status and progress.
self.addEventListener('install', event=>{

    event.waitUntil(
        caches.open(CACHE_NAME).then(cache=>{

            let fileCachingCounter = 0;
            let totalCacheSize = 0;

            fetch(CACHE_LIST_SOURCE)
                .then(response=>{
                    return response.json();
                })
                .then(files=>{

                    totalCacheSize = files.length;

                    files.forEach(file=>{

                        cache.match(file).then(response => {
                            if(!response)
                                cache.add(file)
                                    .then(()=>{
                                        console.log(LOG_TAG+CACHED_FILE+file);

                                        fileCachingCounter++;

                                        //reports progress to the client
                                        clientMng.sendMessage(CACHED_FILE,MessageTypes.INFO,{
                                            'progress':(fileCachingCounter/totalCacheSize)
                                        });
                                    })
                                    .catch(err=>{
                                        console.error(err);

                                        if(err.code===22) //quota exceed
                                            err.message = CANNOT_CACHE_ALL_FILES;

                                        clientMng.sendMessage(err.message, MessageTypes.WARN);
                                    });
                        });
                    });
                })
                .catch(err=>{
                    console.error(err);
                    clientMng.sendMessage(CANNOT_FETCH_PARSE, MessageTypes.ERROR);
                });
        })
        .catch(err=>{
            console.error(err);
            clientMng.sendMessage(CANNOT_OPEN_CACHE, MessageTypes.ERROR);
        })
    );
});

self.addEventListener('activate', ()=>{
    return clientMng.claimClients(self);
});

//Returns files from cache when available
//there, or looks to network
self.addEventListener('fetch', function(event) {
    event.respondWith(
        caches.match(event.request).then(function(response) {
            return response || fetch(event.request);
        })
    );
});

