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

        this.id = ++INDEX;
        this.ip = ip;
        this.socket = socket;
        this.encoder = encoder;

        this.onOpen = this.onOpen.bind(this);
        this.onMessage = this.onMessage.bind(this);
        this.onError = this.onError.bind(this);
        this.onClose = this.onClose.bind(this);

        this.socket.on('open', this.onOpen);
        this.socket.on('message', this.onMessage);
        this.socket.on('error', this.onError);
        this.socket.on('close', this.onClose);

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
     * On socket open
     */
    onOpen() {
        this.emit('open', this);
    }

    /**
     * On message
     *
     * @param {Event} event
     */
    onMessage(event) {
        try {
            const { name, data } = this.encoder.decode(event.data);

            this.emit(name, data, this);
        } catch (error) {
            console.error('[ERROR] Could not parse message:', error, '\n\r\tEvent: ', event);
        }
    }

    /**
     * On error
     *
     * @param {Event} event
     */
    onError(event) {
        console.error(`[ERROR] In socket for client ${this.id}: `, event.message);
        this.emit('error', new Error(event.message), this);
        this.close();
    }

    /**
     * On close
     */
    onClose() {
        this.socket = null;
        this.emit('close', this);
    }
}
