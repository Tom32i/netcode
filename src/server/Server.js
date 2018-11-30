import http from 'http';
import EventEmitter from 'events';
import WebSocket from 'websocket-driver';
import JsonEncoder from 'netcode/src/encoder/JsonEncoder';
import Client from 'netcode/src/server/Client';
import Beacon from 'netcode/src/server/Beacon';

export default class Server extends EventEmitter {
    /**
     * @param {Number} port Port to listen on
     * @param {String} host Host to listen on
     * @param {JsonEncoder|BinaryEncoder} encoder Encoder to use to read/write event messages
     * @param {Number} ping Ping frequency in seconds (0 for no ping)
     * @param {Number} maxLength Paquet max length in bit
     * @param {Array} protocols Supported protocols
     */
    constructor(port = 8080, host = '0.0.0.0', encoder = new JsonEncoder(), ping = 30, maxLength = Math.pow(2, 9), protocols = ['websocket']) {
        super();

        this.onUpgrade = this.onUpgrade.bind(this);
        this.onRequest = this.onRequest.bind(this);
        this.onError = this.onError.bind(this);
        this.removeClient = this.removeClient.bind(this);

        this.port = port;
        this.host = host;
        this.encoder = encoder;
        this.server = http.createServer();
        this.clients = new Map();
        this.ping = ping;
        this.options = {
            maxLength,
            protocols,
        };

        this.server.on('upgrade', this.onUpgrade);
        this.server.on('request', this.onRequest);
        this.server.on('error', this.onError);

        this.start();
    }

    /**
     * Start listening for clients
     *
     * @param {Number} port
     * @param {String} host
     */
    start() {
        this.server.listen(this.port, this.host);
        this.emit('ready');
    }

    /**
     * Adds a new client
     *
     * @param {Client} client
     */
    addClient(client) {
        this.clients.set(client.id, client);
        client.on('close', this.removeClient);
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

        if (this.ping) {
            new Beacon(driver, this.ping);
        }

        this.addClient(new Client(driver, ip, this.encoder));
    }

    /**
     * On request
     *
     * @param {Request} request
     * @param {Response} response
     */
    onRequest(request, response) {
        switch (request.url) {
            default:
                response.writeHead(404);
                response.end();
                break;
        }
    }

    /**
     * On error
     *
     * @param {Error} error
     */
    onError(error) {
        this.emit('error', error);
    }
}
