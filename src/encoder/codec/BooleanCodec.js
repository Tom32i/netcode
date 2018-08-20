/**
 *  Boolean codec
 */
export default class BooleanCodec {
    /**
     * Byte length
     *
     * @type {Number}
     */
    static get byteLength() { return 1; }

    /**
     * {@inheritdoc}
     */
    static encode(buffer, offset, data) {
        new Uint8Array(buffer, offset, 1)[0] = data ? 1 : 0;

        return offset + this.byteLength;
    }

    /**
     * {@inheritdoc}
     */
    static decode(buffer, offset) {
        return new Uint8Array(buffer, offset, 1)[0] > 0;
    }
}
