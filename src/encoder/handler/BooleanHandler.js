import Handler from 'netcode/encoder/handler/Handler';
import BooleanCodec from 'netcode/encoder/codec/BooleanCodec';

/**
 *  Boolean event handler
 */
export default class BooleanHandler extends Handler {
    /**
     * Byte length
     *
     * @type {Number}
     */
    static get byteLength() { return Handler.byteLength + BooleanCodec.byteLength; }

    /**
     * {@inheritdoc}
     */
    encode(data, extraLength = 0) {
        const buffer = super.encode(data, extraLength);

        BooleanCodec.encode(buffer, Handler.byteLength, data);

        return buffer;
    }

    /**
     * {@inheritdoc}
     */
    decode(buffer) {
        return BooleanCodec.decode(buffer, Handler.byteLength);
    }
}
