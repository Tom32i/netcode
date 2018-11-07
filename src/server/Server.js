import http from 'http';
import EventEmitter from 'events';
import WebSocket from 'websocket-driver';
import JsonEncoder from 'netcode/src/encoder/JsonEncoder';
import Client from 'netcode/src/server/Client';

export default class Server extends EventEmitter {
    /**
     * @param {Number} port Port
     * @param {String} host Host
     * @param {JsonEncoder|BinaryEncoder} encoder
     * @param {Number} ping Ping frequency in seconds (0 for no ping)
     * @param {Number} maxLength Paquet max length in bit
     * @param {Array} protocols Supported protocols
     */
    constructor(port = 8080, host = 'localhost', encoder = new JsonEncoder(), ping = 0, maxLength = Math.pow(2, 9) - 1, protocols = ['websocket']) {
        super();

        this.onUpgrade = this.onUpgrade.bind(this);
        //this.onRequest = this.onRequest.bind(this);
        this.onError = this.onError.bind(this);
        this.removeClient = this.removeClient.bind(this);

        this.encoder = encoder;
        this.server = http.createServer();
        this.clients = new Map();
        this.ping = ping;
        this.options = {
            maxLength,
            protocols,
        };

        this.server.on('error', this.onError);
        this.server.on('upgrade', this.onUpgrade);
        //this.server.on('request', this.onRequest);

        this.start(port, host);
    }

    /**
     * Start listening for clients
     *
     * @param {Number} port
     * @param {String} host
     */
    start(port, host) {
        this.server.listen(port, host);
        this.emit('ready');
    }

    /**
     * Adds a new client
     *
     * @param {Client} client
     */
    addClient(client) {
        this.clients.set(client.id, client);
        client.addListener('close', this.removeClient);
        this.emit('client:join', client);
    }

    /**
     * Remove a client
     *
     * @param {Client} client
     */
    removeClient(client) {
        client.removeListener('close', this.removeClient);
        this.clients.delete(client.id);
        this.emit('client:leave', client);
    }

    /**
     * On HTTP WebSocket upgrade request
     *
     * @param {Request} request
     * @param {Socket} socket
     * @param {Object} body
     */
    onUpgrade(request, socket, body) {
        if (!WebSocket.isWebSocket(request)) {
            return socket.end();
        }

        const ip = request.headers['x-real-ip'] || request.connection.remoteAddress;
        const driver = WebSocket.http(request, this.options);

        driver.io.write(body);
        socket.pipe(driver.io).pipe(socket);

        this.addClient(new Client(driver, ip, this.encoder, this.ping * 1000));
    }

    /**
     * On request
     *
     * @param {Request} request
     * @param {Response} response
     */
    /*onRequest(request, response) {
        switch (request.url) {
            case '/':
                response.writeHead(200, { 'Content-Type': 'application/json' });
                response.end(JSON.stringify(this.getStatus()));
                break;

            default:
                response.writeHead(404);
                response.end();
                break;
        }
    }*/

    /**
     * On error
     *
     * @param {Error} error
     */
    onError(error) {
        this.emit('error', error);
    }
}
