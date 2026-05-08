import Codec from './Codec.js';

/**
 *  8 bit signed Int codec (-128 to 127)
 */
export default class Int8Codec extends Codec {
    /**
     * @type {Number}
     */
    getByteLength() {
        return Int8Array.BYTES_PER_ELEMENT;
    }

    /**
     * {@inheritdoc}
     */
    encode(buffer, offset, data) {
        new DataView(buffer).setInt8(offset, data);
    }

    /**
     * {@inheritdoc}
     */
    decode(buffer, offset) {
        return new DataView(buffer).getInt8(offset);
    }
}
