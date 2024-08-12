import Codec from './Codec.js';

/**
 *  16 bit signed Int codec (-32768 to 32767)
 */
export default class Int16Codec extends Codec {
    /**
     * @type {Number}
     */
    getByteLength() {
        return Int16Array.BYTES_PER_ELEMENT;
    }

    /**
     * {@inheritdoc}
     */
    encode(buffer, offset, data) {
        new DataView(buffer).setInt16(offset, data);
    }

    /**
     * {@inheritdoc}
     */
    decode(buffer, offset) {
        return new DataView(buffer).getInt16(offset);
    }
}
