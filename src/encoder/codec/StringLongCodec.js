import Codec from './Codec.js';
import { utf8ByteLength } from '../utf8.js';

/**
 * A longer string would wrap the length prefix: the receiver would then read
 * the rest of the string as the following fields.
 *
 * @param {Number} length
 *
 * @return {Number}
 */
function checkLength(length) {
    if (length > 65535) {
        throw new RangeError(`String is ${length} bytes, StringLongCodec max is 65535`);
    }

    return length;
}

/**
 *  Long String codec (limited to 65536 chars)
 */
export default class StringLongCodec extends Codec {
    /**
     * @type {Number}
     */
    getByteLength(data) {
        return 2 + checkLength(utf8ByteLength(data || ''));
    }

    /**
     * {@inheritdoc}
     */
    encode(cursor, data) {
        // Reserve the length prefix, then fill it with the byte count actually written
        const lengthOffset = cursor.reserve(2);

        cursor.view.setUint16(lengthOffset, checkLength(cursor.writeUtf8(data || '')));
    }

    /**
     * {@inheritdoc}
     */
    decode(cursor) {
        return cursor.readUtf8(cursor.readUint16());
    }
}
