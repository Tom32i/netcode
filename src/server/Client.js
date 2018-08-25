import EventEmitter from 'events';

let INDEX = 0;

export default class Client extends EventEmitter {
    /**
     * @param {WebSocket} socket
     * @param {String} ip
     * @param {Encoder} encoder
     */
    constructor(socket, ip, encoder) {
        super();

        this.socket = socket;
        this.ip = ip;
        this.encoder = encoder;
        this.id = ++INDEX;

        this.onMessage = this.onMessage.bind(this);
        this.onError = this.onError.bind(this);
        this.onClose = this.onClose.bind(this);

        this.socket.on('message', this.onMessage);
        this.socket.on('error', this.onError);
        this.socket.on('close', this.onClose);
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
    }

    /**
     * On close
     */
    onClose() {
        this.socket = null;
        this.emit('close', this);
    }
}
