import EventEmitter from 'events';

let INDEX = 0;

export default class Client extends EventEmitter {
    /**
     * @param {WebSocket} socket
     * @param {String} ip
     * @param {Encoder} encoder
     * @param {Number} pingFrequency
     */
    constructor(socket, ip, encoder, pingFrequency = 5 * 1000) {
        super();

        this.id = ++INDEX;
        this.ip = ip;
        this.socket = socket;
        this.encoder = encoder;
        this.pingInterval = null;

        this.onMessage = this.onMessage.bind(this);
        this.onError = this.onError.bind(this);
        this.onClose = this.onClose.bind(this);
        this.ping = this.ping.bind(this);

        this.socket.on('message', this.onMessage);
        this.socket.on('error', this.onError);
        this.socket.on('close', this.onClose);

        if (pingFrequency > 0) {
            this.socket.on('open', () => this.startPing(pingFrequency));
        }

        this.socket.send = this.encoder.constructor.binaryType === 'arraybuffer' ? this.socket.binary : this.socket.text;

        this.socket.start();
    }

    /**
     * Send a message
     *
     * @param {String} name
     * @param {Object} data
     */
    send(name, data) {
        this.socket.send(this.encoder.encode(name, data));
    }

    /**
     * Close WebSocket connection
     */
    close() {
        if (this.socket) {
            this.socket.close();
        }
    }

    /**
     * Start ping at given interval
     *
     * @param {Number} frequency
     */
    startPing(frequency) {
        if (frequency) {
            this.pingInterval = setInterval(this.ping, frequency);
        }
    }

    ping() {
        if (this.socket) {
            this.socket.ping();
        }
    }

    /**
     * Stop ping interval
     */
    stopPing() {
        if (this.pingInterval) {
            clearInterval(this.pingInterval);
            this.pingInterval = null;
        }
    }

    /**
     * On message
     *
     * @param {Event} event
     */
    onMessage(event) {
        const { name, data } = this.encoder.decode(event.data);

        this.emit(name, data, this);
    }

    /**
     * On error
     *
     * @param {Event} event
     */
    onError(event) {
        console.error(`Client ${this.id}: `, event.message);
        this.close();
    }

    /**
     * On close
     */
    onClose() {
        this.stopPing();
        this.socket = null;
        this.emit('close', this);
    }
}
