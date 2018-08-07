import BaseBinaryEncoder from 'netcode/encoder/BinaryEncoder';

/**
 * Binary Encoder wrapper for Node
 */
export default class BinaryEncoder extends BaseBinaryEncoder {
    /**
     * {@inheritdoc}
     */
    encode(name, data) {
        return new Buffer(new Uint8Array(super.encode(name, data)));
    }

    /**
     * {@inheritdoc}
     */
    decode(buffer) {
        return super.decode(new Uint8Array(buffer).buffer);
    }
}
