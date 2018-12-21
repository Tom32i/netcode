import Codec from './Codec';

/**
 *  String codec (limited to 65536 chars)
 */
export default class LongStringCodec extends Codec {
    /**
     * @type {Number}
     */
    getByteLength(data) {
        return 2 + (data || '').length * 2;
    }

    /**
     * {@inheritdoc}
     */
    encode(buffer, offset, data) {
        const view = new DataView(buffer, offset, this.getByteLength(data));
        const { length } = (data || '');

        view.setUint16(0, length);

        for (var index = 0; index < length; index++) {
            view.setUint16(2 + (index * 2), data[index].charCodeAt(0));
        }
    }

    /**
     * {@inheritdoc}
     */
    decode(buffer, offset) {
        const view = new DataView(buffer, offset);
        const length = view.getUint16(0);
        const chars = new Array(length);

        for (var index = 0; index < length; index++) {
            chars[index] = view.getUint16(2 + index * 2);
        }

        return String.fromCharCode(...chars);
    }
}
