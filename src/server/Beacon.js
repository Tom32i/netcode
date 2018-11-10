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

        this.start = this.start.bind(this);
        this.ping = this.ping.bind(this);
        this.stop = this.stop.bind(this);

        this.socket.on('open', this.start);
        this.socket.on('close', this.stop);
    }

    start() {
        if (!this.interval) {
            this.interval = setInterval(this.ping, this.frequency);
        }
    }

    stop() {
        if (this.interval) {
            clearInterval(this.interval);
            this.interval = null;
        }
    }

    ping() {
        if (this.socket) {
            this.socket.ping();
        }
    }
}
