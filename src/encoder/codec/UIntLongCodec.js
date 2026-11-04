import Codec from './Codec.js';

/**
 *  Long unsigned int codec
 */
export default class UIntLongCodec extends Codec {
    /**
     * @param {Number} byteLength
     */
    constructor(byteLength) {
        super();

        this.byteLength = byteLength;
    }

    getByteLength() {
        return this.byteLength;
    }

    /**
     * {@inheritdoc}
     */
    encode(cursor, data) {
        if (data >= 256 ** this.byteLength) {
            throw new RangeError(`${data} does not fit in ${this.byteLength} bytes`);
        }

        // Big-endian: most significant byte first. Dividing by a power of 2 is exact.
        for (let index = this.byteLength - 1; index >= 0; index--) {
            cursor.writeUint8(Math.floor(data / 256 ** index) % 256);
        }
    }

    /**
     * {@inheritdoc}
     */
    decode(cursor) {
        let value = 0;

        for (let index = 0; index < this.byteLength; index++) {
            value = value * 256 + cursor.readUint8();
        }

        return value;
    }
}
