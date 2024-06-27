import Codec from './Codec';

/**
 *  Long String codec (limited to 65536 chars)
 */
export default class StringLongCodec extends Codec {
    constructor() {
        super();

        this.encoder = new TextEncoder();
        this.decoder = new TextDecoder(TextEncoder.encoding);
    }

    /**
     * @type {Number}
     */
    getByteLength(data) {
        return 2 + this.encoder.encode(data || '').length;
    }

    /**
     * {@inheritdoc}
     */
    encode(buffer, offset, data) {
        const bytes = this.encoder.encode(data || '');
        const { length } = bytes;
        const view = new DataView(buffer, offset, length + 2);

        view.setUint16(0, length);

        for (var index = 0; index < length; index++) {
            view.setUint8(index + 2, bytes[index]);
        }
    }

    /**
     * {@inheritdoc}
     */
    decode(buffer, offset) {
        const view = new DataView(buffer, offset);
        const length = view.getUint16(0);
        const bytes = buffer.slice(offset + 2, offset + 2 + length);

        return this.decoder.decode(bytes);
    }
}
