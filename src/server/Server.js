import http from 'http';
import EventEmitter from 'events';
import WebSocket from 'ws';
import JsonEncoder from 'netcode/src/encoder/JsonEncoder';
import MapClientDirectory from 'netcode/src/server/MapClientDirectory';
import Client from 'netcode/src/server/Client';
import Beacon from 'netcode/src/server/Beacon';

export default class Server extends EventEmitter {
    /**
     * @param {Number} port Port to listen on
     * @param {String} host Host to listen on
     * @param {JsonEncoder|BinaryEncoder} encoder Encoder to use to read/write event messages
     * @param {Number} ping Ping frequency in seconds (0 for no ping)
     * @param {Number} maxPayload Paquet max length in bit
     * @param {ClientDirectory} clients Clients directory
     */
    constructor(port = 8080, host = '0.0.0.0', encoder = new JsonEncoder(), ping = 30, maxPayload = Math.pow(2, 9), clients = new MapClientDirectory()) {
        super();

        this.onRequest = this.onRequest.bind(this);
        this.onError = this.onError.bind(this);
        this.onConnection = this.onConnection.bind(this);
        this.removeClient = this.removeClient.bind(this);

        this.port = port;
        this.host = host;
        this.encoder = encoder;
        this.server = http.createServer();
        this.socket = new WebSocket.Server({ server: this.server, maxPayload });
        this.clients = clients;
        this.ping = ping;

        this.server.on('request', this.onRequest);
        this.server.on('error', this.onError);
        this.socket.on('connection', this.onConnection);

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
        this.clients.add(client);
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
        this.clients.remove(client);
        this.emit('client:leave', client);
    }

    /**
     * On Socket connection
     *
     * @param {Websocket} socket
     * @param {Request} request
     */
    onConnection(socket, request) {
        const ip = request.headers['x-real-ip'] || request.headers['x-forwarded-for'] || request.connection.remoteAddress;

        this.addClient(new Client(socket, ip, this.encoder));

        if (this.ping) {
            new Beacon(socket, this.ping);
        }
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
