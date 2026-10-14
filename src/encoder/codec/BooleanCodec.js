import Codec from './Codec.js';

/**
 *  Boolean codec
 */
export default class BooleanCodec extends Codec {
    /**
     * @type {Number}
     */
    getByteLength() {
        return 1;
    }

    /**
     * {@inheritdoc}
     */
    encode(cursor, data) {
        cursor.writeUint8(data ? 1 : 0);
    }

    /**
     * {@inheritdoc}
     */
    decode(cursor) {
        return cursor.readUint8() > 0;
    }
}
