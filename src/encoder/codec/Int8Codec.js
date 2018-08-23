import Codec from './Codec';

/**
 *  8 bit Int codec (0 to 255)
 */
export default class Int8Codec extends Codec {
    /**
     * @type {Number}
     */
    getByteLength() {
        return Uint8Array.BYTES_PER_ELEMENT;
    }

    /**
     * {@inheritdoc}
     */
    encode(buffer, offset, data) {
        new DataView(buffer).setUint8(offset, data);
    }

    /**
     * {@inheritdoc}
     */
    decode(buffer, offset) {
        return new DataView(buffer).getUint8(offset);
    }
}
