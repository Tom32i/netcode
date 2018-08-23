import Codec from './Codec';

/**
 *  Boolean codec
 */
export default class BooleanCodec extends Codec {
    /**
     * @type {Number}
     */
    getByteLength() {
        return 1;
    }

    /**
     * {@inheritdoc}
     */
    encode(buffer, offset, data) {
        new DataView(buffer).setUint8(offset, data ? 1 : 0);
    }

    /**
     * {@inheritdoc}
     */
    decode(buffer, offset) {
        return new DataView(buffer).getUint8(offset) > 0;
    }
}
