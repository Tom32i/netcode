/**
 * List clients and handle id generation.
 * Map based implementation.
 * Re-use ids after client disconnection.
 */
export default class MapClientDirectory {
    constructor(max = Math.pow(2, 16)) {
        this.max = max;
        this.clients = new Map();
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
    }

    /**
     * Adds a new client
     *
     * @param {Client} client
     */
    remove(client) {
        this.clients.delete(client.id);
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
        this.clients.forEach(client => (client.id !== target.id) && callback(client));
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
}
