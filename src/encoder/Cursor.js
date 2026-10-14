const textEncoder = new TextEncoder();
const textDecoder = new TextDecoder();

/**
 * Cursor
 *
 * Reads and writes an ArrayBuffer sequentially: every read or write advances the offset.
 */
export default class Cursor {
    /**
     * @param {ArrayBuffer} buffer
     */
    constructor(buffer = new ArrayBuffer(0)) {
        this.reset(buffer);
    }

    /**
     * Point the cursor at the start of the given buffer
     *
     * @param {ArrayBuffer} buffer
     *
     * @return {Cursor}
     */
    reset(buffer) {
        this.buffer = buffer;
        this.view = new DataView(buffer);
        this.offset = 0;

        return this;
    }

    /**
     * Skip bytes to fill in later (e.g. a length prefix)
     *
     * @param {Number} byteLength
     *
     * @return {Number} Offset of the skipped bytes
     */
    reserve(byteLength) {
        const offset = this.offset;
        this.offset += byteLength;

        return offset;
    }

    /**
     * @param {Number} value
     */
    writeUint8(value) {
        this.view.setUint8(this.offset, value);
        this.offset += 1;
    }

    /**
     * @return {Number}
     */
    readUint8() {
        const value = this.view.getUint8(this.offset);
        this.offset += 1;

        return value;
    }

    /**
     * @param {Number} value
     */
    writeInt8(value) {
        this.view.setInt8(this.offset, value);
        this.offset += 1;
    }

    /**
     * @return {Number}
     */
    readInt8() {
        const value = this.view.getInt8(this.offset);
        this.offset += 1;

        return value;
    }

    /**
     * @param {Number} value
     */
    writeUint16(value) {
        this.view.setUint16(this.offset, value);
        this.offset += 2;
    }

    /**
     * @return {Number}
     */
    readUint16() {
        const value = this.view.getUint16(this.offset);
        this.offset += 2;

        return value;
    }

    /**
     * @param {Number} value
     */
    writeInt16(value) {
        this.view.setInt16(this.offset, value);
        this.offset += 2;
    }

    /**
     * @return {Number}
     */
    readInt16() {
        const value = this.view.getInt16(this.offset);
        this.offset += 2;

        return value;
    }

    /**
     * @param {Number} value
     */
    writeUint32(value) {
        this.view.setUint32(this.offset, value);
        this.offset += 4;
    }

    /**
     * @return {Number}
     */
    readUint32() {
        const value = this.view.getUint32(this.offset);
        this.offset += 4;

        return value;
    }

    /**
     * @param {Number} value
     */
    writeInt32(value) {
        this.view.setInt32(this.offset, value);
        this.offset += 4;
    }

    /**
     * @return {Number}
     */
    readInt32() {
        const value = this.view.getInt32(this.offset);
        this.offset += 4;

        return value;
    }

    /**
     * @param {Number} value
     */
    writeFloat32(value) {
        this.view.setFloat32(this.offset, value);
        this.offset += 4;
    }

    /**
     * @return {Number}
     */
    readFloat32() {
        const value = this.view.getFloat32(this.offset);
        this.offset += 4;

        return value;
    }

    /**
     * @param {Number} value
     */
    writeFloat64(value) {
        this.view.setFloat64(this.offset, value);
        this.offset += 8;
    }

    /**
     * @return {Number}
     */
    readFloat64() {
        const value = this.view.getFloat64(this.offset);
        this.offset += 8;

        return value;
    }

    /**
     * @param {Uint8Array} bytes
     */
    writeBytes(bytes) {
        new Uint8Array(this.buffer, this.offset, bytes.length).set(bytes);
        this.offset += bytes.length;
    }

    /**
     * Read bytes (as a view on the buffer, not a copy)
     *
     * @param {Number} length
     *
     * @return {Uint8Array}
     */
    readBytes(length) {
        const bytes = new Uint8Array(this.buffer, this.offset, length);
        this.offset += length;

        return bytes;
    }

    /**
     * Write a string as UTF-8 bytes (encoded straight into the buffer)
     *
     * @param {String} string
     *
     * @return {Number} Number of bytes written
     */
    writeUtf8(string) {
        const { written } = textEncoder.encodeInto(string, new Uint8Array(this.buffer, this.offset));
        this.offset += written;

        return written;
    }

    /**
     * Read a UTF-8 string of the given byte length
     *
     * @param {Number} length
     *
     * @return {String}
     */
    readUtf8(length) {
        return textDecoder.decode(this.readBytes(length));
    }
}
