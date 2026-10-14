const nonAscii = /[\u0080-\uFFFF]/;

/**
 * Byte length of a string once UTF-8 encoded, without encoding it.
 * Lone surrogates count as U+FFFD (3 bytes), as TextEncoder encodes them.
 *
 * @param {String} string
 *
 * @return {Number}
 */
export function utf8ByteLength(string) {
    const { length } = string;

    // Native ASCII check beats the loop past a few dozen chars
    if (length >= 32 && !nonAscii.test(string)) {
        return length;
    }

    let byteLength = length;

    for (let index = 0; index < length; index++) {
        const code = string.charCodeAt(index);

        if (code < 0x80) {
            continue;
        }

        if (code < 0x800) {
            byteLength += 1;
        } else if (code >= 0xD800 && code <= 0xDBFF && index + 1 < length) {
            const next = string.charCodeAt(index + 1);

            if (next >= 0xDC00 && next <= 0xDFFF) {
                // Surrogate pair: 4 bytes for 2 UTF-16 units
                byteLength += 2;
                index++;
            } else {
                byteLength += 2;
            }
        } else {
            byteLength += 2;
        }
    }

    return byteLength;
}
