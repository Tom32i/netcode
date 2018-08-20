import Handler from 'netcode/encoder/handler/Handler';
import Int8Codec from 'netcode/encoder/codec/Int8Codec';

/**
 *  8 bit Int event handler (0 to 255)
 */
export default class Int8Handler extends Handler {
    /**
     * Byte length
     *
     * @type {Number}
     */
    static get byteLength() { return Handler.byteLength + Int8Codec.byteLength; }

    /**
     * {@inheritdoc}
     */
    encode(data, extraLength = 0) {
        const buffer = super.encode(data, extraLength);

        Int8Codec.encode(buffer, Handler.byteLength, data);

        return buffer;
    }

    /**
     * {@inheritdoc}
     */
    decode(buffer) {
        return Int8Codec.decode(buffer, Handler.byteLength);
    }
}
