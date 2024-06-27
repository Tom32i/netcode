import Codec from './Codec';

/**
 *  String codec (limited to 255 chars)
 */
export default class StringCodec extends Codec {
    constructor() {
        super();

        this.encoder = new TextEncoder();
        this.decoder = new TextDecoder(TextEncoder.encoding);
    }

    /**
     * @type {Number}
     */
    getByteLength(data) {
        return 1 + this.encoder.encode(data || '').length;
    }

    /**
     * {@inheritdoc}
     */
    encode(buffer, offset, data) {
        const bytes = this.encoder.encode(data || '');
        const { length } = bytes;
        const view = new DataView(buffer, offset, length + 1);

        view.setUint8(0, length);

        for (var index = 0; index < length; index++) {
            view.setUint8(index + 1, bytes[index]);
        }
    }

    /**
     * {@inheritdoc}
     */
    decode(buffer, offset) {
        const view = new DataView(buffer, offset);
        const length = view.getUint8(0);
        const bytes = buffer.slice(offset + 1, offset + 1 + length);

        return this.decoder.decode(bytes);
    }
}
