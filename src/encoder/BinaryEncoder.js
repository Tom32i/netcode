import Int16Codec from 'netcode/encoder/codec/Int16Codec';

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
        const index = Int16Codec.decode(buffer, 0);
        const handler = this.handlers[index];

        if (!handler) {
            throw new Error(`No handler found at index "${index}"`);
        }

        return { name: handler.name, data: handler.decode(buffer) };
    }

}
