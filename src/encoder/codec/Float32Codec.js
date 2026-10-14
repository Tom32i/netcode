import Codec from './Codec.js';

/**
 *  32 bit Float codec
 */
export default class Float32Codec extends Codec {
    /**
     * @type {Number}
     */
    getByteLength() {
        return BigUint64Array.BYTES_PER_ELEMENT / 2;
    }

    /**
     * {@inheritdoc}
     */
    encode(cursor, data) {
        cursor.writeFloat32(data);
    }

    /**
     * {@inheritdoc}
     */
    decode(cursor) {
        return cursor.readFloat32();
    }
}
