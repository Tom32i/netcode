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
        this.minimum = codec.minimum ?? -Infinity;
        this.maximum = codec.maximum ?? Infinity;
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
        const rounded = value < 0 ? -Math.round(-value) : Math.round(value);

        // Clamp to the int codec's range: 127.6 rounds to 128, which an Int8 would wrap to -128.
        this.codec.encode(cursor, Math.min(Math.max(rounded, this.minimum), this.maximum));
    }

    /**
     * {@inheritdoc}
     */
    decode(cursor) {
        return this.codec.decode(cursor) / this.factor;
    }
}
