import Codec from './Codec';

/**
 *  32 bit Int codec (0 to 4294967295)
 */
export default class Int32Codec extends Codec {
    /**
     * @type {Number}
     */
    getByteLength() {
        return Uint32Array.BYTES_PER_ELEMENT;
    }

    /**
     * {@inheritdoc}
     */
    encode(buffer, offset, data) {
        new DataView(buffer).setUint32(offset, data);
    }

    /**
     * {@inheritdoc}
     */
    decode(buffer, offset) {
        return new DataView(buffer).getUint32(offset);
    }
}
