import Codec from './Codec.js';

/**
 *  8 bit unsigned Int codec (0 to 255)
 */
export default class UInt8Codec extends Codec {
    /**
     * @type {Number}
     */
    getByteLength() {
        return Uint8Array.BYTES_PER_ELEMENT;
    }

    /**
     * {@inheritdoc}
     */
    encode(cursor, data) {
        cursor.writeUint8(data);
    }

    /**
     * {@inheritdoc}
     */
    decode(cursor) {
        return cursor.readUint8();
    }
}
