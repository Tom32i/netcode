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
    encode(cursor, data) {
        cursor.writeFloat64(data);
    }

    /**
     * {@inheritdoc}
     */
    decode(cursor) {
        return cursor.readFloat64();
    }
}
