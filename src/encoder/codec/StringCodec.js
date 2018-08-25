import Codec from './Codec';

/**
 *  String codec (limited to 255 chars)
 */
export default class StringCodec extends Codec {
    /**
     * @type {Number}
     */
    getByteLength(data) {
        return 1 + data.length * 2;
    }

    /**
     * {@inheritdoc}
     */
    encode(buffer, offset, data) {
        const view = new DataView(buffer, offset, this.getByteLength(data));

        view.setUint8(0, data.length);

        Array.from(data).forEach((letter, index) => view.setUint16(1 + (index * 2), letter.charCodeAt(0)));
    }

    /**
     * {@inheritdoc}
     */
    decode(buffer, offset) {
        const view = new DataView(buffer, offset);
        const length = view.getUint8(0);

        return new Array(length).fill(null).map((value, index) => String.fromCharCode(view.getUint16(1 + index * 2))).join('');
    }
}
