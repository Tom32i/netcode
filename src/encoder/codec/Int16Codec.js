import Codec from './Codec';

/**
 *  16 bit Int codec (0 to 65535)
 */
export default class Int16Codec extends Codec {
    /**
     * @type {Number}
     */
    getByteLength() {
        return Uint16Array.BYTES_PER_ELEMENT;
    }

    /**
     * {@inheritdoc}
     */
    encode(buffer, offset, data) {
        new DataView(buffer).setUint16(offset, data);
    }

    /**
     * {@inheritdoc}
     */
    decode(buffer, offset) {
        return new DataView(buffer).getUint16(offset);
    }
}
