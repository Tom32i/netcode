import Handler from 'netcode/encoder/handler/Handler';

/**
 *  16 bit encoder Int event handler (0 to 65535)
 */
export default class Int16Handler extends Handler {
    /**
     * Byte length
     *
     * @type {Number}
     */
    static get byteLength() { return Handler.byteLength + 2; }

    /**
     * {@inheritdoc}
     */
    encode(data, extraLength = 0) {
        const buffer = super.encode(data, extraLength);

        new Uint16Array(buffer, Handler.byteLength, 1)[0] = data;

        return buffer;
    }

    /**
     * {@inheritdoc}
     */
    decode(buffer) {
        return {
            name: this.name,
            data: new Uint16Array(buffer, Handler.byteLength, 1)[0],
        };
    }
}
