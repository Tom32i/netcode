import Codec from './Codec.js';

/**
 *  32 bit unsigned Int codec (0 to 4294967295)
 */
export default class UInt32Codec extends Codec {
    /**
     * @type {Number}
     */
    getByteLength() {
        return Uint32Array.BYTES_PER_ELEMENT;
    }

    /**
     * {@inheritdoc}
     */
    encode(cursor, data) {
        cursor.writeUint32(data);
    }

    /**
     * {@inheritdoc}
     */
    decode(cursor) {
        return cursor.readUint32();
    }
}
