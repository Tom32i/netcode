/**
 *  16 bit Int codec (0 to 65535)
 */
export default class Int16Codec  {
    /**
     * Byte length
     *
     * @type {Number}
     */
    static get byteLength() { return 2; }

    /**
     * {@inheritdoc}
     */
    static encode(buffer, offset, data) {
        new Uint16Array(buffer, offset, 1)[0] = data;

        return offset + this.byteLength;
    }

    /**
     * {@inheritdoc}
     */
    static decode(buffer, offset) {
        return new Uint16Array(buffer, offset, 1)[0];
    }
}
