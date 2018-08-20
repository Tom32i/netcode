/**
 *  8 bit Int codec (0 to 255)
 */
export default class Int8Codec  {
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
        new Uint8Array(buffer, offset, 1)[0] = data;

        return offset + this.byteLength;
    }

    /**
     * {@inheritdoc}
     */
    static decode(buffer, offset) {
        return new Uint8Array(buffer, offset, 1)[0];
    }
}
