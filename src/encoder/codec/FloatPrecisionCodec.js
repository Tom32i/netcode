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
        const value = data * this.factor;

        // Round instead of letting the int codec truncate (0.29 * 100 = 28.999999999999996).
        // Halves round away from zero, like Go's math.Round.
        this.codec.encode(cursor, value < 0 ? -Math.round(-value) : Math.round(value));
    }

    /**
     * {@inheritdoc}
     */
    decode(cursor) {
        return this.codec.decode(cursor) / this.factor;
    }
}
