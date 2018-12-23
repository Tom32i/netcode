const { Server, BinaryEncoder, Codec, Int8Codec, Int16Codec, LongIntCodec, BooleanCodec, StringCodec } = require('./server');

// Register your events
const encoder = new BinaryEncoder([
    ['id', new Int16Codec()],
    ['ping', new LongIntCodec(6)],
    ['pong', new LongIntCodec(6)],
    ['inverse', new BooleanCodec()],
    ['greeting', new StringCodec()],
    ['total', new Int8Codec()],
]);

// Create the server
const server = new Server(process.argv[2], 'localhost', encoder, 10);

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
        console.log('Client %s geets you: "%s"', client.id, message);
        // Send a "greeting" event
        client.send('greeting', 'Hello, I\'m server 😊!');
    });

    // Send event "id" to the client
    client.send('id', client.id);

    if (server.clients.length > 1) {
        server.clients.forEach(client => client.send('total', server.clients.length));
    }
});

// Listen for disconnecting clients
server.on('client:leave', client => {
    console.log('Client %s left.', client.id);
});

module.exports = server;
