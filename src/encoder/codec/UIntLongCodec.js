import Codec from './Codec.js';

/**
 *  Long unsigned int codec
 */
export default class UIntLongCodec extends Codec {
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
        const bin = this.bytePad(data.toString(2), this.byteLength).match(/.{8}/g);
        bin.forEach((value, index) => view.setUint8(index, parseInt(value, 2)));
    }

    /**
     * {@inheritdoc}
     */
    decode(buffer, offset) {
        const view = new Uint8Array(buffer, offset, this.byteLength);
        return parseInt(Array.from(view).map(value => this.bytePad(value.toString(2), 1)).join(''), 2);
    }

    /**
     * Fill the binaryString with zeros to make whole bytes.
     *
     * @param {String} binaryString
     * @param {Number} byteLength
     *
     * @return {String}
     */
    bytePad(binaryString, byteLength) {
        return '0'.repeat((8 * byteLength) - binaryString.length) + binaryString;
    }
}
