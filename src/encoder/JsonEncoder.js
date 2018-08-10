export default class JsonEncoder {
    static get binaryType() { return 'blob'; }

    /**
     * Encode
     *
     * @param {String} name
     * @param {Object|Number|Boolean|String|Null} data
     *
     * @return {String}
     */
    encode(name, data) {
        return JSON.stringify({ name, data });
    }

    /**
     * Decode
     *
     * @param {String} value
     *
     * @return {Object}
     */
    decode(value) {
        try {
            return JSON.parse(value);
        } catch(error) {
            return null;
        }
    }
}
