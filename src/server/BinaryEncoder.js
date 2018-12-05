import BaseBinaryEncoder from 'netcode/src/encoder/BinaryEncoder';

/**
 * Binary Encoder wrapper for Node
 */
export default class BinaryEncoder extends BaseBinaryEncoder {
    /**
     * {@inheritdoc}
     */
    encode(name, data) {
        return Buffer.from(super.encode(name, data));
    }

    /**
     * {@inheritdoc}
     */
    decode(buffer) {
        return super.decode(buffer.buffer);
    }
}
