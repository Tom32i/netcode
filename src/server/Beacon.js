/**
 * Send ping at fixed interval
 */
export default class Beacon {
    /**
     * @param {Client} client
     * @param {Number} frequency Frequency in second
     */
    constructor(client, emit, frequency = 30) {
        this.client = client;
        this.socket = client.socket;
        this.emit = emit;
        this.frequency = frequency * 1000;
        this.interval = null;

        this.start = this.start.bind(this);
        this.stop = this.stop.bind(this);
        this.sendPing = this.sendPing.bind(this);
        this.onPong = this.onPong.bind(this);

        if (this.socket.readyState === 1) {
            this.start();
        } else {
            this.socket.on('open', this.start);
        }
    }

    /**
     * Start ping interval
     */
    start() {
        this.socket.off('open', this.start);

        if (this.interval === null) {
            this.socket.on('pong', this.onPong);
            this.socket.on('close', this.stop);
            this.interval = setInterval(this.sendPing, this.frequency);
            setImmediate(this.sendPing);
        }
    }

    /**
     * Stop ping interval
     */
    stop() {
        if (this.interval !== null) {
            clearInterval(this.interval);
            this.interval = null;
            this.socket.off('pong', this.onPong);
            this.socket.off('close', this.stop);
        }
    }

    /**
     * Send ping
     */
    sendPing() {
        this.socket.ping(performance.now());
    }
    /**
     * Receive pong
     */
    onPong(buffer) {
        const now = performance.now();
        const ping = parseFloat(buffer.toString());

        this.emit('pong', { client: this.client, duration: now - ping });
    }
}
