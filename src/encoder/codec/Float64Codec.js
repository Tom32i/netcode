import Codec from './Codec.js';

/**
 *  64 bit Float codec
 */
export default class Float64Codec extends Codec {
    /**
     * @type {Number}
     */
    getByteLength() {
        return BigUint64Array.BYTES_PER_ELEMENT;
    }

    /**
     * {@inheritdoc}
     */
    encode(buffer, offset, data) {
        new DataView(buffer).setFloat64(offset, data);
    }

    /**
     * {@inheritdoc}
     */
    decode(buffer, offset) {
        return new DataView(buffer).getFloat64(offset);
    }
}
