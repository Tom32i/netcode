import Codec from './Codec.js';

/**
 *  Float precision codec
 *  - UInt8 with precision of 2: (-1.28 to 1.27)
 *  - Int32 with precision of 3: (0 to 4294967.295)
 */
export default class FloatPrecisionCodec extends Codec {
    constructor(codec, precision) {
        super();

        this.codec = new codec();
        this.factor = 10**precision;
    }

    getByteLength(data) {
        return this.codec.getByteLength(data);
    }

    /**
     * {@inheritdoc}
     */
    encode(cursor, data) {
        this.codec.encode(cursor, data * this.factor);
    }

    /**
     * {@inheritdoc}
     */
    decode(cursor) {
        return this.codec.decode(cursor) / this.factor;
    }
}
