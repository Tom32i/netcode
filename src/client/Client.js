import EventEmitter from 'tom32i-event-emitter.js';
import JsonEncoder from 'netcode/src/encoder/JsonEncoder';

export default class Client extends EventEmitter {
    /**
     * @param {String} host
     * @param {JsonEncoder|BinaryEncoder} encoder
     */
    constructor(host, encoder = new JsonEncoder()) {
        super();

        this.encoder = encoder;
        this.socket = new WebSocket(host, 'websocket');

        if (this.encoder.constructor.binaryType) {
            this.socket.binaryType = this.encoder.constructor.binaryType;
        }

        this.onOpen = this.onOpen.bind(this);
        this.onClose = this.onClose.bind(this);
        this.onError = this.onError.bind(this);
        this.onMessage = this.onMessage.bind(this);

        this.socket.addEventListener('open', this.onOpen);
        this.socket.addEventListener('close', this.onClose);
        this.socket.addEventListener('error', this.onError);
        this.socket.addEventListener('message', this.onMessage);
    }

    /**
     * Send data over WebSocket
     *
     * @param {String} name
     * @param {Any} data
     */
    send(name, data) {
        this.socket.send(this.encoder.encode(name, data));
    }

    /**
     * Close connection
     */
    close() {
        this.socket.close();
    }

    /**
     * On connexion open
     */
    onOpen() {
        this.emit('open', this);
    }

    /**
     * On message received from the server
     *
     * @param {Event} event
     */
    onMessage(event) {
        const { name, data } = this.encoder.decode(event.data);

        this.emit(name, data);
    }

    /**
     * On close
     */
    onClose() {
        this.socket.removeEventListener('open', this.onOpen);
        this.socket.removeEventListener('close', this.onClose);
        this.socket.removeEventListener('error', this.onError);
        this.socket.removeEventListener('message', this.onMessage);
        this.emit('close', this);
    }

    /**
     * On error
     *
     * @param {Error} error
     */
    onError(error) {
        this.emit('error', error, this);
    }
}
