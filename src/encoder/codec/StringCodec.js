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
    if (length > 255) {
        throw new RangeError(`String is ${length} bytes, StringCodec max is 255: use StringLongCodec`);
    }

    return length;
}

/**
 *  String codec (up to 255 bytes once UTF-8 encoded)
 */
export default class StringCodec extends Codec {
    /**
     * @type {Number}
     */
    getByteLength(data) {
        return 1 + checkLength(utf8ByteLength(String(data || '')));
    }

    /**
     * {@inheritdoc}
     */
    encode(cursor, data) {
        // Reserve the length prefix, then fill it with the byte count actually written
        const lengthOffset = cursor.reserve(1);

        cursor.view.setUint8(lengthOffset, checkLength(cursor.writeUtf8(String(data || ''))));
    }

    /**
     * {@inheritdoc}
     */
    decode(cursor) {
        return cursor.readUtf8(cursor.readUint8());
    }
}
