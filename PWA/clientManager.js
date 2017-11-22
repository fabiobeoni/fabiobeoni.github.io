class ClientManager {

    constructor(serviceID){
        //@private
        this._clients = {};

        //@private
        this._serviceID = serviceID;
    }

    claimClients(serviceWorker, includeUncontrolled=true){
        serviceWorker.clients.matchAll({
            includeUncontrolled: includeUncontrolled
        }).then(clients => {
            this._clients = clients;
        });

        return serviceWorker.clients.claim();
    }

    sendMessage(text,type=MessageTypes.INFO,data=null){
        if(this._clients && this._clients.length>0)
            this._clients.forEach(client => {
                client.postMessage({
                    "serviceID": this._serviceID,
                    "text": text,
                    "type":type,
                    "data":data
                });
            });
    }
}

const MessageTypes = {
    INFO:0,
    WARN:1,
    ERROR:2
};