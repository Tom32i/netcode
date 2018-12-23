import EventEmitter from 'events';

export default class Client extends EventEmitter {
    /**
     * @param {WebSocket} socket
     * @param {String} ip
     * @param {Encoder} encoder
     */
    constructor(socket, ip, encoder) {
        super();

        this.id = null;
        this.ip = ip;
        this.socket = socket;
        this.encoder = encoder;

        if (this.encoder.constructor.binaryType) {
            this.socket.binaryType = this.encoder.constructor.binaryType;
        }

        this.onOpen = this.onOpen.bind(this);
        this.onMessage = this.onMessage.bind(this);
        this.onError = this.onError.bind(this);
        this.onClose = this.onClose.bind(this);

        this.socket.addEventListener('message', this.onMessage);
        this.socket.addEventListener('error', this.onError);
        this.socket.addEventListener('close', this.onClose);

        if (socket.readyState < 1) {
            this.socket.addEventListener('open', this.onOpen);
        } else {
            this.onOpen();
        }
    }

    /**
     * Set id
     *
     * @param {Number|String} id
     */
    setId(id) {
        this.id = id;
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
