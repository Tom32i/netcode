/**
 * List clients and handle id generation.
 * Map based implementation.
 * Re-use ids after client disconnection.
 */
export default class MapClientDirectory {
    constructor() {
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
        let id = 1;

        while (this.clients.has(id)) {
            id++;
        }

        return id;
    }

    /**
     * Adds a new client
     *
     * @param {Client} client
     */
    add(client) {
        client.setId(this.generateId());
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
