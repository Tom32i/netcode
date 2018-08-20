import Handler from 'netcode/encoder/handler/Handler';
import Int16Codec from 'netcode/encoder/codec/Int16Codec';

/**
 *  16 bit Int event handler (0 to 4294967295)
 */
export default class Int16Handler extends Handler {
    /**
     * Byte length
     *
     * @type {Number}
     */
    static get byteLength() { return Handler.byteLength + Int16Codec.byteLength; }

    /**
     * {@inheritdoc}
     */
    encode(data, extraLength = 0) {
        const buffer = super.encode(data, extraLength);

        Int16Codec.encode(buffer, Handler.byteLength, data);

        return buffer;
    }

    /**
     * {@inheritdoc}
     */
    decode(buffer) {
        return Int16Codec.decode(buffer, Handler.byteLength);
    }
}
