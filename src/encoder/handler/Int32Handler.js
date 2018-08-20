import Handler from 'netcode/encoder/handler/Handler';
import Int32Codec from 'netcode/encoder/codec/Int32Codec';

/**
 *  32 bit Int event handler (0 to 4294967295)
 */
export default class Int32Handler extends Handler {
    /**
     * Byte length
     *
     * @type {Number}
     */
    static get byteLength() { return Handler.byteLength + Int32Codec.byteLength; }

    /**
     * {@inheritdoc}
     */
    encode(data, extraLength = 0) {
        const buffer = super.encode(data, extraLength);

        Int32Codec.encode(buffer, Handler.byteLength, data);

        return buffer;
    }

    /**
     * {@inheritdoc}
     */
    decode(buffer) {
        return Int32Codec.decode(buffer, Handler.byteLength);
    }
}
