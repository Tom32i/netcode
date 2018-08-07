/**
 * Handler
 */
export default class Handler {
    /**
     * Buffer byte length
     *
     * @type {Number}
     */
    static get byteLength() { return 2; }

    /**
     * Constructor
     */
    constructor(name = null) {
        this.name = name || this.constructor.name;
        this.index = 0;
    }

    /**
     * Encode
     *
     * @param {Object} data
     * @param {Number} extraLength
     *
     * @return {Buffer}
     */
    encode(data, extraLength = 0) {
        const buffer = new ArrayBuffer(this.constructor.byteLength + extraLength);

        new Uint16Array(buffer, 0, 1)[0] = this.index;

        return buffer;
    }

    /**
     * Decode
     *
     * @param {Buffer} buffer
     *
     * @return {Array}
     */
    decode(buffer) {
        return { name: this.name };
    }
}
