import encodeMessage from './encodeMessage.js';

/**
 * List clients and handle id generation.
 * Map based implementation.
 * Re-use ids after client disconnection.
 */
export default class MapClientDirectory {
    constructor(encoder, max = Math.pow(2, 16)) {
        this.encoder = encoder;
        this.max = max;
        this.clients = new Map();
        // The id this directory gave each client: another directory holding the client may overwrite client.id.
        this.ids = new Map();
    }

    /**
     * Get length of the clients
     *
     * @return {Number}
     */
    get length() {
        return this.clients.size;
    }

    /**
     * Generate a new unique id
     *
     * @return {Number|String}
     */
    generateId() {
        for (let id = 0; id < this.max; id++) {
            if (!this.clients.has(id)) {
                return id;
            }
        }

        throw new Error(`Max clients reached ${this.max}.`);
    }

    /**
     * Adds a new client
     *
     * @param {Client} client
     */
    add(client) {
        client.id = this.generateId();
        this.clients.set(client.id, client);
        this.ids.set(client, client.id);
    }

    /**
     * Removes a client, by the id this directory gave it
     *
     * @param {Client} client
     */
    remove(client) {
        this.clients.delete(this.ids.get(client));
        this.ids.delete(client);
    }

    count() {
        return this.length;
    }

    /**
     * Execute the given callback for every client
     *
     * @param {Function} callback
     */
    forEach(callback) {
        this.clients.forEach(callback);
    }

    /**
     * Execute the given callback for every client exept the given target
     *
     * @param {Client} target
     * @param {Function} callback
     */
    forOther(target, callback) {
        this.clients.forEach(client => (client !== target) && callback(client));
    }

    /**
     * Execute the given callback for every client that match the given filter
     *
     * @param {Function} filter
     * @param {Function} callback
     */
    forFilter(filter, callback) {
        this.clients.forEach(client => filter(client) && callback(client));
    }

    /**
     * Write buffer to all clients
     *
     * @param  {ArrayBuffer} data
     */
    writeAll(data) {
        this.clients.forEach(client => client.write(data));
    }

    /**
     * Write buffer to all other clients
     *
     * @param  {Client} target Client to exclude
     * @param  {ArrayBuffer} data
     */
    writeOther(target, data) {
        this.clients.forEach(client => {
            if (client !== target) {
                client.write(data);
            }
        });
    }

    /**
     * Encode and send a message to a single client
     *
     * @param {Client} client
     * @param {String} name
     * @param {Object} data
     */
    send(client, name, data) {
        client.send(name, data);
    }

    /**
     * Encode and send a message to all clients
     *
     * @param {String} name
     * @param {Object} data
     */
    sendAll(name, data) {
        const buffer = encodeMessage(this.encoder, name, data);

        if (buffer !== null) {
            this.writeAll(buffer);
        }
    }

    /**
     * Encode and send a message to all other clients
     *
     * @param {Client} target Client to exclude
     * @param {String} name
     * @param {Object} data
     */
    sendOther(target, name, data) {
        const buffer = encodeMessage(this.encoder, name, data);

        if (buffer !== null) {
            this.writeOther(target, buffer);
        }
    }
}
