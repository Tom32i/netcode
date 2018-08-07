import Handler from 'netcode/encoder/handler/Handler';
import { bytePad } from 'netcode/utils';

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
        const view = new Uint8Array(buffer, Handler.byteLength, 6);
        const bin = bytePad(data.toString(2), 6);

        view.forEach((value, index) => { view[index] = parseInt(bin.substr(index * 8, 8), 2); });

        return buffer;
    }

    /**
     * {@inheritdoc}
     */
    decode(buffer) {
        const view = new Uint8Array(buffer, Handler.byteLength, 6);

        return {
            name: this.name,
            data: parseInt(Array.from(view).map(value => bytePad(value.toString(2), 1)).join(''), 2),
        };
    }
}
