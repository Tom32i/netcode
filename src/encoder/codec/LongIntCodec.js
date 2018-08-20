import { bytePad } from 'netcode/utils';

/**
 *  Boolean codec
 */
export default class LongIntCodec {
    /**
     * {@inheritdoc}
     */
    static encode(buffer, offset, byteLength, data) {
        const view = new Uint8Array(buffer, offset, byteLength);
        const bin = bytePad(data.toString(2), byteLength);

        view.forEach((value, index) => { view[index] = parseInt(bin.substr(index * 8, 8), 2); });

        return offset + this.byteLength;
    }

    /**
     * {@inheritdoc}
     */
    static decode(buffer, offset, byteLength) {
        const view = new Uint8Array(buffer, offset, byteLength);

        return parseInt(Array.from(view).map(value => bytePad(value.toString(2), 1)).join(''), 2);
    }
}
