const { Server, BinaryEncoder, Codec, UInt8Codec, UInt16Codec, UIntLongCodec, BooleanCodec, StringLongCodec } = require('./server');

// Register your events
const encoder = new BinaryEncoder([
    ['id', new UInt8Codec()],
    ['ping', new UIntLongCodec(6)],
    ['pong', new UIntLongCodec(6)],
    ['inverse', new BooleanCodec()],
    ['greeting', new StringLongCodec()],
    ['total', new UInt8Codec()],
]);

// Create the server
const port = process.argv[2] || 8002;
const server = new Server(port, '127.0.0.1', encoder, 3);

// Listen for new clients
server.on('client:join', client => {
    console.log('Client %s joined.', client.id);

    // Listen for "ping" event
    client.on('ping', ping => {
        // Answer with a "pong" event
        client.send('pong', Date.now());
        console.log('Client %s ping received: %s.', client.id, ping);

        // Send a "inverse" event
        client.send('inverse', true);
    });

    // Listen for "inverse" event
    client.on('inverse', status => {
        console.log('Client %s inverse received: %s.', client.id, status);
    });

    // Listen for "greeting" event
    client.on('greeting', message => {
        console.log('Client %s greets you: "%s"', client.id, message);
        // Send a "greeting" event
        client.send('greeting', 'Hello, I\'m server! 😊 Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut imperdiet molestie libero, ut sollicitudin tortor dignissim quis. Nulla iaculis nisi turpis, a malesuada nibh faucibus a. Nunc tellus lorem, varius sit amet tellus eu, dictum consectetur nulla.');
    });

    // Send event "id" to the client
    client.send('id', client.id);

    broadcastTotal();
});

// Listen for disconnecting clients
server.on('client:leave', client => {
    console.log('Client %s left.', client.id);
    broadcastTotal();
});

server.on('ready', () => console.log('Listening on port %s', port));

function broadcastTotal() {
    const { length } = server.clients;
    server.clients.forEach(client => client.send('total', length));
}

module.exports = server;
