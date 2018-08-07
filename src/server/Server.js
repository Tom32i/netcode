const http = require('http');
const EventEmitter = require('events');
const WebSocket = require('faye-websocket');

class Server extends EventEmitter {
    /**
     * Constructor
     *
     * @param {String} url
     * @param {Number} port
     * @param {String} host
     */
    constructor(url, port = 8080, host = 'localhost', encoder = null) {
        super();

        this.onUpgrade = this.onUpgrade.bind(this);
        this.onRequest = this.onRequest.bind(this);
        this.onDisconnect = this.onDisconnect.bind(this);
        this.onError = this.onError.bind(this);

        this.port = port;
        this.host = host;
        this.server = http.createServer();
        this.encoder = encoder;

        this.server.on('error', this.onError);
        this.server.on('upgrade', this.onUpgrade);
        this.server.on('request', this.onRequest);

        this.start(port, host);
    }

    /**
     * Start listening for clients
     *
     * @param {Number} port
     * @param {String} host
     */
    onReady(port, host) {
        this.server.listen(port, host);
        this.log(`Server listening at "${this.host}:${this.port}"`);
        console.info();
        this.emit('ready');
    }

    /**
     * Adds a new client
     *
     * @param {Client} client
     */
    addClient(client) {
        this.clients.set(client.id, client);
        client.addListener('close', this.onDisconnect);
        this.game.onJoin(client);
        this.emit('client:join', client);
    }

    /**
     * On HTTP WebSocket upgrade request
     *
     * @param {Request} request
     * @param {Socket} socket
     * @param {Object} head
     *
     * @return {Boolean}
     */
    onUpgrade(request, socket, head) {
        if (!WebSocket.isWebSocket(request)) {
            return socket.end();
        }

        const options = { maxLength: Math.pow(2, 9) - 1, ping: 30 };
        const websocket = new WebSocket(request, socket, head, 'websocket', options);
        const ip = request.headers['x-real-ip'] || request.connection.remoteAddress;

        this.addClient(new Client(websocket, ip, this.encoder));

        return true;
    }

    /**
     * On socket connection
     *
     * @param {SocketClient} client
     */
    onDisconnect(client) {
        client.removeListener('close', this.onDisconnect);
        this.clients.delete(client.id);
        this.game.onLeave(client);
        this.emit('client:leave', client);
        console.info('Client %s disconnected.', client.id);
    }

    /**
     * On request
     *
     * @param {Request} request
     * @param {Response} response
     */
    onRequest(request, response) {
        switch (request.url) {
            case '/':
                response.writeHead(200, { 'Content-Type': 'application/json' });
                response.end(JSON.stringify(this.getStatus()));
                break;

            case '/current':
                if (!this.game.song || !this.game.song.store.isReady()) {
                    response.writeHead(404);
                    response.end();
                } else {
                    this.game.song.store.get().pipe(response);
                }

                break;

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
        throw error;
    }

    /**
     * Get status
     *
     * @return {Object}
     */
    getStatus() {
        return {
            name: this.game.playlist.name,
            cover: this.game.playlist.cover,
            size: this.clients.size,
        };
    }

    /**
     * Log the given message
     *
     * @param {[type]} message
     *
     * @return {[type]}
     */
    log(message) {
        if (!this.silent) {
            console.info(message);
        }
    }
}

module.exports = Server;
