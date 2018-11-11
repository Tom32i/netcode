import Codec from './Codec';

/**
 *  String codec (limited to 65536 chars)
 */
export default class LongStringCodec extends Codec {
    /**
     * @type {Number}
     */
    getByteLength(data) {
        return 2 + data.length * 2;
    }

    /**
     * {@inheritdoc}
     */
    encode(buffer, offset, data) {
        const view = new DataView(buffer, offset, this.getByteLength(data));

        view.setUint16(0, data.length);

        Array.from(data).forEach((letter, index) => view.setUint16(2 + (index * 2), letter.charCodeAt(0)));
    }

    /**
     * {@inheritdoc}
     */
    decode(buffer, offset) {
        const view = new DataView(buffer, offset);
        const length = view.getUint16(0);

        return new Array(length).fill(null).map((value, index) => String.fromCharCode(view.getUint16(2 + index * 2))).join('');
    }
}
