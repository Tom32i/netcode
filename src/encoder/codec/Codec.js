/* eslint-disable no-unused-vars */

/**
 * Codec
 */
export default class Codec {
    /**
     * Buffer byte length
     *
     * @param {Object|Number|Boolean|String|null} data
     *
     * @type {Number}
     */
    getByteLength(data) {
        return 0;
    }

    /**
     * Encode
     *
     * @param {ArrayBuffer} data
     * @param {Number} Offset
     * @param {Object} data
     */
    encode(buffer, offset, data) {}

    /**
     * Decode
     *
     * @param {Buffer} buffer
     * @param {Number} offset
     *
     * @return {Object|Number|Boolean|String|null}
     */
    decode(buffer, offset) {
        return null;
    }
}
