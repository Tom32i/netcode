/**
 *  32 bit Int codec (0 to 4294967295)
 */
export default class Int32Codec {
    /**
     * Byte length
     *
     * @type {Number}
     */
    static get byteLength() { return 4; }

    /**
     * {@inheritdoc}
     */
    static encode(buffer, offset, data) {
        new Uint32Array(buffer, offset, 1)[0] = data;

        return offset + this.byteLength;
    }

    /**
     * {@inheritdoc}
     */
    static decode(buffer, offset) {
        return new Uint32Array(buffer, offset, 1)[0];
    }
}
