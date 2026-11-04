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
    encode(cursor, data) {
        cursor.writeInt16(data);
    }

    /**
     * {@inheritdoc}
     */
    decode(cursor) {
        return cursor.readInt16();
    }
}
