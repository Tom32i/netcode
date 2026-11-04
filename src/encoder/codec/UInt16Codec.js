import Codec from './Codec.js';

/**
 *  16 bit unsigned Int codec (0 to 65535)
 */
export default class UInt16Codec extends Codec {
    /**
     * @type {Number}
     */
    getByteLength() {
        return Uint16Array.BYTES_PER_ELEMENT;
    }

    /**
     * {@inheritdoc}
     */
    encode(cursor, data) {
        cursor.writeUint16(data);
    }

    /**
     * {@inheritdoc}
     */
    decode(cursor) {
        return cursor.readUint16();
    }
}
