import http from 'http';
import EventEmitter from 'events';
import { WebSocketServer } from 'ws';
import JsonEncoder from '../encoder/JsonEncoder.js';
import MapClientDirectory from './MapClientDirectory.js';
import Client from './Client.js';
import Beacon from './Beacon.js';

export default class Server extends EventEmitter {
    /**
     * @param {Number} port Port to listen on
     * @param {String} host Host to listen on
     * @param {JsonEncoder|BinaryEncoder} encoder Encoder to use to read/write event messages
     * @param {Number} pingInterval Ping frequency in seconds (0 for no ping)
     * @param {Number} maxPayload Paquet max length in bit (should be a power of two)
     * @param {ClientDirectory} clients Clients directory
     * @param {Boolean} autoStart Auto start server on construct
     */
    constructor(
        port = 8080,
        host = '0.0.0.0',
        encoder = new JsonEncoder(),
        pingInterval = 30,
        maxPayload = Math.pow(2, 9),
        clients = new MapClientDirectory(),
        autoStart = true
    ) {
        super();

        this.start = this.start.bind(this);
        this.onRequest = this.onRequest.bind(this);
        this.onError = this.onError.bind(this);
        this.onConnection = this.onConnection.bind(this);
        this.onListening = this.onListening.bind(this);
        this.removeClient = this.removeClient.bind(this);
        this.emit = this.emit.bind(this);

        this.port = port;
        this.host = host;
        this.encoder = encoder;
        this.server = http.createServer();
        this.socket = new WebSocketServer({
            server: this.server,
            maxPayload
        });
        this.clients = clients;
        this.pingInterval = pingInterval;

        this.server.on('request', this.onRequest);
        this.server.on('error', this.onError);

        this.socket.on('connection', this.onConnection);
        this.socket.on('listening', this.onListening);

        if (autoStart) {
            this.start();
        }
    }

    /**
     * Start listening for clients
     *
     * @param {Number} port
     * @param {String} host
     */
    start() {
        this.server.listen(this.port, this.host);
    }

    /**
     * Adds a new client
     *
     * @param {Client} client
     * @param {Request} request
     */
    addClient(client, request) {
        this.clients.add(client);
        client.on('close', this.removeClient);
        this.emit('client:join', client, request);
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
     * Underlying server is ready
     */
    onListening() {
        this.emit('ready');
    }

    /**
     * On Socket connection
     *
     * @param {Websocket} socket
     * @param {Request} request
     */
    onConnection(socket, request) {
        const ip = request.headers['x-real-ip'] || request.headers['x-forwarded-for'] || request.connection.remoteAddress;
        const client = new Client(socket, ip, this.encoder);

        this.addClient(client, request);

        if (this.pingInterval) {
            new Beacon(client, this.emit, this.pingInterval);
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
