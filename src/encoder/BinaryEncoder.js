import Int8Codec from 'netcode/src/encoder/codec/Int8Codec';

export default class BinaryEncoder {
    /**
     * WebSocket binary type
     *
     * @return {String}
     */
    static get binaryType() { return 'arraybuffer'; }

    /**
     * Reserved event names
     *
     * @return {String[]}
     */
    static get reservedEvents() { return ['open', 'close', 'error']; }

    /**
     * @param {Array} handlers
     */
    constructor(handlers, idCodec = new Int8Codec()) {
        this.idCodec = idCodec;
        this.handlersByName = new Map(handlers);
        this.handlersById = Array.from(this.handlersByName.values());

        // Set names and ids.
        handlers.forEach(([name, handler], index) => {
            handler.id = index;
            handler.name = name;

            if (this.constructor.reservedEvents.includes(name)) {
                throw new Error(`"${name}" is a reserved event name.`);
            }
        });
    }

    /**
     * Encode event
     *
     * @param {String} name
     * @param {Object|Number|Boolean|String|null} data
     *
     * @return {ArrayBuffer}
     */
    encode(name, data) {
        const handler = this.handlersByName.get(name);

        if (!handler) {
            throw new Error(`No handler found for event "${name}"`);
        }

        const idByteLength = this.idCodec.getByteLength();
        const buffer = new ArrayBuffer(idByteLength + handler.getByteLength(data));

        this.idCodec.encode(buffer, 0, handler.id);
        handler.encode(buffer, idByteLength, data);

        return buffer;
    }

    /**
     * Decode event
     *
     * @param {ArrayBuffer} buffer
     *
     * @return {Object}
     */
    decode(buffer) {
        if (!buffer.byteLength) {
            throw new Error('Empty buffer');
        }

        const id = this.idCodec.decode(buffer, 0);
        const handler = this.handlersById[id];

        if (!handler) {
            throw new Error(`No handler found at index "${id}"`);
        }

        return { name: handler.name, data: handler.decode(buffer, this.idCodec.getByteLength()) };
    }

}
