import Codec from './Codec.js';

/**
 *  8 bit signed Int codec (-128 to 127)
 */
export default class Int8Codec extends Codec {
    static minimum = -128;
    static maximum = 127;

    /**
     * @type {Number}
     */
    getByteLength() {
        return Int8Array.BYTES_PER_ELEMENT;
    }

    /**
     * {@inheritdoc}
     */
    encode(cursor, data) {
        cursor.writeInt8(data);
    }

    /**
     * {@inheritdoc}
     */
    decode(cursor) {
        return cursor.readInt8();
    }
}
