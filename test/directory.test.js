import { describe, test, expect, beforeEach } from 'vitest';
import MapClientDirectory from '../src/server/MapClientDirectory.js';

/**
 * Minimal encoder stub: encodes to a recognisable string buffer.
 */
const encoder = { encode: (name, data) => `[${name}:${data}]` };

/**
 * Minimal client stub recording what it received.
 */
function createClient() {
    return {
        id: null,
        sent: [],
        written: [],
        send(name, data) { this.sent.push(`${name}:${data}`); },
        write(buffer) { this.written.push(buffer); },
    };
}

describe('MapClientDirectory', () => {
    let directory;
    let a;
    let b;
    let c;

    beforeEach(() => {
        directory = new MapClientDirectory(encoder);
        a = createClient();
        b = createClient();
        c = createClient();
        directory.add(a);
        directory.add(b);
        directory.add(c);
    });

    test('assigns incremental ids and reuses freed ones', () => {
        expect([a.id, b.id, c.id]).toEqual([0, 1, 2]);

        directory.remove(b);
        const d = createClient();
        directory.add(d);

        expect(d.id).toBe(1);
    });

    test('count() and length report the number of clients', () => {
        expect(directory.count()).toBe(3);
        expect(directory.length).toBe(3);

        directory.remove(a);

        expect(directory.count()).toBe(2);
        expect(directory.length).toBe(2);
    });

    test('forEach visits every client', () => {
        const visited = [];
        directory.forEach(client => visited.push(client.id));

        expect(visited.sort()).toEqual([0, 1, 2]);
    });

    test('forOther visits every client except the target', () => {
        const visited = [];
        directory.forOther(b, client => visited.push(client.id));

        expect(visited.sort()).toEqual([0, 2]);
    });

    test('forFilter visits only matching clients', () => {
        const visited = [];
        directory.forFilter(client => client.id > 0, client => visited.push(client.id));

        expect(visited.sort()).toEqual([1, 2]);
    });

    test('writeAll writes the same buffer to every client', () => {
        directory.writeAll('raw');

        expect(a.written).toEqual(['raw']);
        expect(b.written).toEqual(['raw']);
        expect(c.written).toEqual(['raw']);
    });

    test('writeOther writes to every client except the target', () => {
        directory.writeOther(b, 'raw');

        expect(a.written).toEqual(['raw']);
        expect(b.written).toEqual([]);
        expect(c.written).toEqual(['raw']);
    });

    test('send delegates encoding to a single client', () => {
        directory.send(a, 'ping', 1);

        expect(a.sent).toEqual(['ping:1']);
        expect(b.sent).toEqual([]);
    });

    test('sendAll encodes once and writes the buffer to every client', () => {
        directory.sendAll('total', 3);

        expect(a.written).toEqual(['[total:3]']);
        expect(b.written).toEqual(['[total:3]']);
        expect(c.written).toEqual(['[total:3]']);
    });

    test('sendOther encodes once and writes to every client except the target', () => {
        directory.sendOther(b, 'hi', 7);

        expect(a.written).toEqual(['[hi:7]']);
        expect(b.written).toEqual([]);
        expect(c.written).toEqual(['[hi:7]']);
    });

    test('generateId throws when the directory is full', () => {
        const full = new MapClientDirectory(encoder, 1);
        full.add(createClient());

        expect(() => full.add(createClient())).toThrow(/Max clients reached/);
    });
});
