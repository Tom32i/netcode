import Cursor from './Cursor.js';
import UInt8Codec from './codec/UInt8Codec.js';

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
    constructor(handlers, idCodec = new UInt8Codec()) {
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

        const buffer = new ArrayBuffer(this.idCodec.getByteLength() + handler.getByteLength(data));
        const cursor = new Cursor(buffer);

        this.idCodec.encode(cursor, handler.id);
        handler.encode(cursor, data);

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

        const cursor = new Cursor(buffer);
        const id = this.idCodec.decode(cursor);
        const handler = this.handlersById[id];

        if (!handler) {
            throw new Error(`No handler found at index "${id}"`);
        }

        return {
            name: handler.name,
            data: handler.decode(cursor),
        };
    }

}
