/**
 * Encode a message, or log why it can't be and return null: like the Go server,
 * a payload the codec refuses (e.g. a string over its limit) skips the message
 * instead of throwing out of a game loop and stopping the process.
 *
 * @param {JsonEncoder|BinaryEncoder} encoder
 * @param {String} name
 * @param {Object} data
 *
 * @return {ArrayBuffer|String|null}
 */
export default function encodeMessage(encoder, name, data) {
    try {
        return encoder.encode(name, data);
    } catch (error) {
        console.error(`[ERROR] Could not encode message "${name}":`, error);

        return null;
    }
}
