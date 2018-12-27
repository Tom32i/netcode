/**
 * Send ping at fixed interval
 */
export default class Beacon {
    /**
     * @param {Socket} socket
     * @param {Number} frequency Frequency in second
     */
    constructor(socket, frequency = 30) {
        this.socket = socket;
        this.frequency = frequency * 1000;
        this.interval = null;
        this.alive = true;

        this.start = this.start.bind(this);
        this.stop = this.stop.bind(this);
        this.ping = this.ping.bind(this);
        this.onPing = this.onPing.bind(this);
        this.onPong = this.onPong.bind(this);

        this.socket.addEventListener('pong', this.onPong);
        this.socket.addEventListener('close', this.stop);

        if (this.socket.readyState === 1) {
            this.start();
        } else {
            this.socket.addEventListener('open', this.start);
        }
    }

    /**
     * Start ping interval
     */
    start() {
        if (!this.interval) {
            this.interval = setInterval(this.ping, this.frequency);
        }
    }

    /**
     * Stop ping interval
     */
    stop() {
        if (this.interval) {
            clearInterval(this.interval);
            this.interval = null;
        }
    }

    /**
     * Ping
     */
    ping() {
        if (!this.alive) {
            return this.socket.terminate();
        }

        this.alive = false;
        this.socket.ping(this.onPing);
    }

    /**
     * On ping
     */
    onPing() {

    }

    /**
     * On pong
     */
    onPong() {
        this.alive = true;
    }
}
