import { bytePad } from 'netcode/src/utils';
import Codec from './Codec';

/**
 *  Boolean codec
 */
export default class LongIntCodec extends Codec {
    /**
     * @param {Number} byteLength
     */
    constructor(byteLength) {
        super();

        this.byteLength = byteLength;
    }

    getByteLength() {
        return this.byteLength;
    }

    /**
     * {@inheritdoc}
     */
    encode(buffer, offset, data) {
        const view = new DataView(buffer, offset, this.byteLength);
        const bin = bytePad(data.toString(2), this.byteLength).match(/.{8}/g);

        bin.forEach((value, index) => view.setUint8(index, parseInt(value, 2)));
    }

    /**
     * {@inheritdoc}
     */
    decode(buffer, offset) {
        const view = new Uint8Array(buffer, offset, this.byteLength);

        return parseInt(Array.from(view).map(value => bytePad(value.toString(2), 1)).join(''), 2);
    }
}
