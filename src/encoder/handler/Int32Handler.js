import Handler from 'netcode/encoder/handler/Handler';

/**
 *  32 bit encoder Int event handler (0 to 4294967295)
 */
export default class Int32Handler extends Handler {
    /**
     * Byte length
     *
     * @type {Number}
     */
    static get byteLength() { return Handler.byteLength + 4; }

    /**
     * {@inheritdoc}
     */
    encode(data, extraLength = 0) {
        const buffer = super.encode(data, extraLength);

        new Uint32Array(buffer, Handler.byteLength, 1)[0] = data;

        return buffer;
    }

    /**
     * {@inheritdoc}
     */
    decode(buffer) {
        return {
            name: this.name,
            data: new Uint32Array(buffer, Handler.byteLength, 1)[0],
        };
    }
}
