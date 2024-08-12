/* global netcode */
window.addEventListener('load', () => {
    const { Client, BinaryEncoder, UInt8Codec, UIntLongCodec, BooleanCodec, StringLongCodec } = netcode;

    // Register your events
    const encoder = new BinaryEncoder([
        ['id', new UInt8Codec()],
        ['ping', new UIntLongCodec(6)],
        ['pong', new UIntLongCodec(6)],
        ['inverse', new BooleanCodec()],
        ['greeting', new StringLongCodec()],
        ['total', new UInt8Codec()],
    ]);

    // Create the client
    const client = new Client('ws://127.0.0.1:8002', encoder);
    let ping;

    // Listen for a "pong" event
    client.on('pong', ({ detail: pong }) => {
        console.info('pong: %s ms (%s - %s)', pong - ping, pong, ping);
    });

    // Listen for an "id" event
    client.on('id', ({ detail: id }) => {
        console.info('connected with id %s', id);
        ping = Date.now();

        console.info('sending ping: %s', ping);

        // Send a "ping" event
        client.send('ping', ping);
    });

    // Listen for a "total" event
    client.on('total', ({ detail: total }) => {
        console.info(`There is ${total} people connected.`);
    });

    // Listen for an "inverse" event
    client.on('inverse', ({ detail: status }) => {
        // Answer with an "inverse" event
        client.send('inverse', !status);
        console.info('Inverse received: %s', status);

        // Send a "greeting" event
        client.send('greeting', 'Hello, I\'m client 😊! Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut imperdiet molestie libero, ut sollicitudin tortor dignissim quis. Nulla iaculis nisi turpis, a malesuada nibh faucibus a. Nunc tellus lorem, varius sit amet tellus eu, dictum consectetur nulla.');
        // client.send('greeting', 'Hi!');
    });

    // Listen for a "greeting" event
    client.on('greeting', ({ detail: message }) => {
        console.info('Servers geets you: "%s"', message);
    });

    // Listen for oppening connection
    client.on('open', () => {
        console.info('Connection open.');
        setTimeout(() => client.close(1000, 'All good :)'), 20 * 1000);
    });

    // Listen for connection close
    client.on('close', (data) => {
        console.info('Connection closed.', data);
    });
});
