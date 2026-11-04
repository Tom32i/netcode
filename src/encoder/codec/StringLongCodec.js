import StringCodec from './StringCodec.js';

/**
 *  Long String codec (up to 65535 bytes once UTF-8 encoded)
 */
export default class StringLongCodec extends StringCodec {
    /**
     * {@inheritdoc}
     */
    get prefixByteLength() {
        return 2;
    }

    /**
     * {@inheritdoc}
     */
    get maxByteLength() {
        return 65535;
    }

    /**
     * {@inheritdoc}
     */
    writeLength(cursor, offset, length) {
        cursor.view.setUint16(offset, length);
    }

    /**
     * {@inheritdoc}
     */
    readLength(cursor) {
        return cursor.readUint16();
    }
}
