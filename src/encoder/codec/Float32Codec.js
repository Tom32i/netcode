import Codec from './Codec.js';

/**
 *  32 bit Float codec
 */
export default class Float32Codec extends Codec {
    /**
     * @type {Number}
     */
    getByteLength() {
        return BigUint64Array.BYTES_PER_ELEMENT / 2;
    }

    /**
     * {@inheritdoc}
     */
    encode(buffer, offset, data) {
        new DataView(buffer).setFloat32(offset, data);
    }

    /**
     * {@inheritdoc}
     */
    decode(buffer, offset) {
        return new DataView(buffer).getFloat32(offset);
    }
}
