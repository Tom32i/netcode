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
     * Encode the data at the cursor position, advancing the cursor
     *
     * @param {Cursor} cursor
     * @param {Object|Number|Boolean|String|null} data
     */
    encode(cursor, data) {}

    /**
     * Decode the data at the cursor position, advancing the cursor
     *
     * @param {Cursor} cursor
     *
     * @return {Object|Number|Boolean|String|null}
     */
    decode(cursor) {
        return null;
    }
}
