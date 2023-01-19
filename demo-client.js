window.addEventListener('load', () => {
    const { Client, BinaryEncoder, Codec, Int8Codec, Int16Codec, LongIntCodec, BooleanCodec, StringCodec } = netcode;

    // Register your events
    const encoder = new BinaryEncoder([
        ['id', new Int16Codec()],
        ['ping', new LongIntCodec(6)],
        ['pong', new LongIntCodec(6)],
        ['inverse', new BooleanCodec()],
        ['greeting', new StringCodec()],
        ['total', new Int8Codec()],
    ]);

    // Create the client
    const client = new Client('ws://127.0.0.1:8002', encoder);
    let ping;

    // Listen for a "pong" event
    client.on('pong', ({ detail: pong }) => {
        console.info('pong: %s ms', pong - ping);
    });

    // Listen for an "id" event
    client.on('id', ({ detail: id }) => {
        console.log('connected with id %s', id);
        ping = Date.now();

        // Send a "ping" event
        client.send('ping', ping);
    });

    // Listen for a "total" event
    client.on('total', ({ detail: total }) => {
        console.log(`There is ${total} people connected.`)
    });

    // Listen for an "inverse" event
    client.on('inverse', ({ detail: status }) => {
        // Answer with an "inverse" event
        client.send('inverse', !status);
        console.log('Inverse received: %s', status);

        // Send a "greeting" event
        client.send('greeting', 'Hello, I\'m client 😊!');
    });

    // Listen for a "greeting" event
    client.on('greeting', ({ detail: message }) => {
        console.log('Servers geets you: "%s"', message);
    });

    // Listen for oppening connection
    client.on('open', () => {
        console.info('Connection open.');

        setTimeout(() => client.close(), 20 * 1000);
    });

    // Listen for connection close
    client.on('close', () => {
        console.info('Connection closed.');
    });
});
