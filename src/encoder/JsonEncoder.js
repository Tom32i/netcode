export default class JsonEncoder {
    /**
     * WebSocket binary type
     *
     * @return {String}
     */
    static get binaryType() { return null; }

    /**
     * Reserved event names
     *
     * @return {String[]}
     */
    static get reservedEvents() { return ['open', 'close', 'error']; }

    /**
     * Encode
     *
     * @param {String} name
     * @param {Object|Number|Boolean|String|Null} data
     *
     * @return {String}
     */
    encode(name, data) {
        if (this.constructor.reservedEvents.includes(name)) {
            throw new Error(`"${name}" is a reserved event name.`);
        }

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
