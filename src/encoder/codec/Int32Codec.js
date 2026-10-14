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
    encode(cursor, data) {
        cursor.writeInt32(data);
    }

    /**
     * {@inheritdoc}
     */
    decode(cursor) {
        return cursor.readInt32();
    }
}
