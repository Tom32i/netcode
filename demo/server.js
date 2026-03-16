import {
    Server,
    BinaryEncoder,
    UInt8Codec,
    UIntLongCodec,
    Int16Codec,
    BooleanCodec,
    StringLongCodec,
} from 'netcode/server';

// Register your events
const encoder = new BinaryEncoder([
    ['id', new UInt8Codec()],
    ['ping', new UIntLongCodec(6)],
    ['pong', new UIntLongCodec(6)],
    ['inverse', new BooleanCodec()],
    ['greeting', new StringLongCodec()],
    ['total', new UInt8Codec()],
    ['int16', new Int16Codec()],
]);

// Create the server
const port = process.argv[2] || 8002;
const server = new Server(port, '127.0.0.1', encoder, 3);

// Listen for new clients
server.on('client:join', client => {
    console.info('Client %s joined.', client.id);

    // Listen for "ping" event
    client.on('ping', ping => {
        // Answer with a "pong" event
        client.send('pong', Date.now());
        console.info('Client %s ping received: %s.', client.id, ping);

        // Send a "inverse" event
        client.send('inverse', true);
    });

    // Listen for "inverse" event
    client.on('inverse', status => {
        console.info('Client %s inverse received: %s.', client.id, status);
    });

    // Listen for "greeting" event
    client.on('greeting', message => {
        console.info('Client %s greets you: "%s"', client.id, message);
        // Send a "greeting" event
        client.send('greeting', 'Hello, I\'m server! 😊 Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut imperdiet molestie libero, ut sollicitudin tortor dignissim quis. Nulla iaculis nisi turpis, a malesuada nibh faucibus a. Nunc tellus lorem, varius sit amet tellus eu, dictum consectetur nulla.');
    });

    // Listen for "int16" event
    client.on('int16', message => {
        console.info('Client %s sends int16: %s', client.id, message);
    });

    // Send event "id" to the client
    client.send('id', client.id);

    broadcastTotal();

    client.send('int16', 32767);
});

// Listen for disconnecting clients
server.on('client:leave', client => {
    console.info('Client %s left.', client.id);
    broadcastTotal();
});

server.on('ping', ({ client }) => console.info('Client %s ping.', client.id));
server.on('pong', ({ client, duration }) => console.info('Client %s ping: %sms', client.id, duration));

server.on('ready', () => console.info('Listening on port %s', port));

function broadcastTotal() {
    const { length } = server.clients;
    server.clients.forEach(client => client.send('total', length));
}
