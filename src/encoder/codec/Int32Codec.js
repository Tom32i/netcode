import Codec from './Codec.js';

/**
 *  32 bit signed Int codec (-2147483648 to 2147483647)
 */
export default class Int32Codec extends Codec {
    /**
     * @type {Number}
     */
    getByteLength() {
        return Int32Array.BYTES_PER_ELEMENT;
    }

    /**
     * {@inheritdoc}
     */
    encode(buffer, offset, data) {
        new DataView(buffer).setInt32(offset, data);
    }

    /**
     * {@inheritdoc}
     */
    decode(buffer, offset) {
        return new DataView(buffer).getInt32(offset);
    }
}
