import { describe, test, expect } from 'vitest';
import Client from '../src/server/Client.js';

/**
 * Minimal open socket stub recording how it was closed.
 */
function createSocket() {
    return {
        readyState: 1,
        closed: null,
        addEventListener() {},
        close(code, reason) { this.closed = { code, reason }; },
    };
}

describe('Client', () => {
    test('close() passes its code and reason on to the socket', () => {
        const socket = createSocket();
        const client = new Client(socket, '127.0.0.1', {});

        client.close(4001, 'inactive');

        expect(socket.closed).toEqual({ code: 4001, reason: 'inactive' });
    });

    test('close() without a code closes the socket normally', () => {
        const socket = createSocket();
        const client = new Client(socket, '127.0.0.1', {});

        client.close();

        expect(socket.closed).toEqual({ code: undefined, reason: undefined });
    });
});
