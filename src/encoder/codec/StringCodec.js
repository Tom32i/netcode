import Codec from './Codec';

/**
 *  String codec (limited to 255 chars)
 */
export default class StringCodec extends Codec {
    /**
     * @type {Number}
     */
    getByteLength(data) {
        return 1 + this.getStrByteLength(data);
    }

    getStrByteLength(data) {
        const { length } = (data || '');
        const byteLength = 0;

        for (var index = 0; index < length; index++) {
            byteLength += data[index].charCodeAt(0) > 0x7ff ? 2 : 1;
        }

        return byteLength;
    }

    /**
     * {@inheritdoc}
     */
    encode(buffer, offset, data) {
        const view = new DataView(buffer, offset);
        const { length } = (data || '');
        const cursor = 1;

        for (var index = 0; index < length; index++) {
            const code = data[index].charCodeAt(0)
            if (code > 0x7ff) {
                console.log('2octet:', index, data[index], code);
                view.setUint16(cursor, code);
                cursor += 2;
            } else {
                console.log('1octet:', index, data[index], code);
                view.setUint8(cursor, code);
                cursor += 1;
            }
        }

        view.setUint8(0, cursor - 1);
    }

    /**
     * {@inheritdoc}
     */
    decode(buffer, offset) {
        const view = new DataView(buffer, offset);
        const length = view.getUint8(0);
        const chars = new Array(length);

        for (var index = 0; index < length; index++) {
            chars[index] = view.getUint16(1 + index * 2);
        }

        return String.fromCharCode(...chars);
    }
}
