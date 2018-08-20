import Handler from 'netcode/encoder/handler/Handler';
import LongIntCodec from 'netcode/encoder/codec/LongIntCodec';

/**
 * Timestamp event handler
 */
export default class TimeStampHandler extends Handler {
    /**
     * Byte length
     *
     * @type {Number}
     */
    static get byteLength() { return Handler.byteLength + 6; }

    /**
     * {@inheritdoc}
     */
    encode(data, extraLength = 0) {
        const buffer = super.encode(data, extraLength);

        LongIntCodec.encode(buffer, Handler.byteLength, 6, data);

        return buffer;
    }

    /**
     * {@inheritdoc}
     */
    decode(buffer) {
        return LongIntCodec.decode(buffer, Handler.byteLength, 6);
    }
}
