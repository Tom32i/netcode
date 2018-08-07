/**
 * Fill the binaryString with zeros to make whole bytes.
 *
 * @param {String} binaryString
 * @param {Number} byteLength
 *
 * @return {String}
 */
export function bytePad(binaryString, byteLength) {
    return '0'.repeat((8 * byteLength) - binaryString.length) + binaryString;
}
