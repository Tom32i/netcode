export default class BinaryEncoder {
    static get binaryType() { return 'arraybuffer'; }

    constructor(handlers = []) {
        this.handlers = handlers;

        this.handlers.forEach((handler, index) => { handler.index = index; });
    }

    /**
     * Encode event
     *
     * @param {String} name
     * @param {Object|Number|Boolean|String|Null} data
     *
     * @return {String}
     */
    encode(name, data) {
        const handler = this.handlers.find(handler => handler.name === name);

        if (!handler) {
            throw new Error(`No handler found for event "${name}"`);
        }

        return handler.encode(data);
    }

    /**
     * Decode event
     *
     * @param {Buffer} buffer
     *
     * @return {Array}
     */
    decode(buffer) {
        const view = new Uint16Array(buffer, 0, 1);
        const handler = this.handlers[view[0]];

        if (!handler) {
            throw new Error(`No handler found for event "${name}"`);
        }

        return handler.decode(buffer);
    }

}
