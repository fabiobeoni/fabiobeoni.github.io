if (navigator['serviceWorker']) {

    const SERVICE_ID = 'pwaService';
    const CACHE_NAME = 'pwa-cache-3';
    const CACHE_FILE = 'to-cache.json';
    const REGISTRATION_COMMAND = `${SERVICE_ID}.js?id=${SERVICE_ID}&cacheName=${CACHE_NAME}&filesToCacheList=${CACHE_FILE}`;

    //replaced 'load' event with 'DOMContentLoaded'
    window.addEventListener('DOMContentLoaded', () => {
        navigator.serviceWorker.register(REGISTRATION_COMMAND)
            .then(()=>{
                navigator.serviceWorker.onmessage = (event)=> {
                    let message = event.data;
                    if (message.serviceID === SERVICE_ID)
                        presentMessage(message);
                };
            })
            .catch(err=>{
                console.error(err);
                alert('Error registering service worker.');
            });
    });

    function presentMessage(message) {
        if(message.data && message.data.progress){
            let elems = document.querySelectorAll('[data-cache-progress]');
            elems.forEach(elem=>{
               elem.innerHTML = message.data.progress;
            });
        }
        else
            document.querySelector('#message').innerText = message.text;
    }
}