import Int16Codec from 'netcode/encoder/codec/Int16Codec';

/**
 * Handler
 */
export default class Handler {
    /**
     * Buffer byte length
     *
     * @type {Number}
     */
    static get byteLength() { return Int16Codec.byteLength; }

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

        Int16Codec.encode(buffer, 0, this.index);

        return buffer;
    }

    /**
     * Decode
     *
     * @param {Buffer} buffer
     *
     * @return {Array}
     */
    decode() {
        return null;
    }
}
