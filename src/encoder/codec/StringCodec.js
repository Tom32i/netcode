import Codec from './Codec.js';
import { utf8ByteLength } from '../utf8.js';

/**
 *  String codec (up to 255 bytes once UTF-8 encoded)
 */
export default class StringCodec extends Codec {
    /**
     * Byte length of the length prefix
     *
     * @type {Number}
     */
    get prefixByteLength() {
        return 1;
    }

    /**
     * Longest string, in UTF-8 bytes, the prefix can hold
     *
     * @type {Number}
     */
    get maxByteLength() {
        return 255;
    }

    /**
     * @type {Number}
     */
    getByteLength(data) {
        return this.prefixByteLength + this.checkLength(utf8ByteLength(data || ''));
    }

    /**
     * {@inheritdoc}
     */
    encode(cursor, data) {
        // Reserve the length prefix, then fill it with the byte count actually written
        const lengthOffset = cursor.reserve(this.prefixByteLength);

        this.writeLength(cursor, lengthOffset, this.checkLength(cursor.writeUtf8(data || '')));
    }

    /**
     * {@inheritdoc}
     */
    decode(cursor) {
        return cursor.readUtf8(this.readLength(cursor));
    }

    /**
     * A longer string would wrap the length prefix: the receiver would then read
     * the rest of the string as the following fields.
     *
     * @param {Number} length
     *
     * @return {Number}
     */
    checkLength(length) {
        if (length > this.maxByteLength) {
            throw new RangeError(`String is ${length} bytes, max is ${this.maxByteLength}`);
        }

        return length;
    }

    /**
     * Write the length prefix at the offset reserved for it
     *
     * @param {Cursor} cursor
     * @param {Number} offset
     * @param {Number} length
     */
    writeLength(cursor, offset, length) {
        cursor.view.setUint8(offset, length);
    }

    /**
     * @param {Cursor} cursor
     *
     * @return {Number}
     */
    readLength(cursor) {
        return cursor.readUint8();
    }
}
