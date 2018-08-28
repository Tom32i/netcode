const { Server, BinaryEncoder, Codec, Int16Codec, LongIntCodec, BooleanCodec, StringCodec } = require('./dist/server');

// Register your events
const encoder = new BinaryEncoder([
    ['open', new Codec()],
    ['id', new Int16Codec()],
    ['ping', new LongIntCodec(6)],
    ['pong', new LongIntCodec(6)],
    ['inverse', new BooleanCodec()],
    ['greeting', new StringCodec()],
]);

// Create the server
const server = new Server(process.argv[2], 'localhost', encoder);

// Listen for new clients
server.addListener('client:join', client => {
    console.log('Client %s joined.', client.id);

    // Listen for "ping" event
    client.addListener('ping', ping => {
        // Answer with a "pong" event
        client.send('pong', Date.now());
        console.log('Client %s ping received: %s.', client.id, ping);

        // Send a "inverse" event
        client.send('inverse', true);
    });

    // Listen for "inverse" event
    client.addListener('inverse', status => {
        console.log('Client %s inverse received: %s.', client.id, status);
    });

    // Listen for "greeting" event
    client.addListener('greeting', message => {
        console.log('Client %s geets you: "%s"', client.id, message);
        // Send a "greeting" event
        client.send('greeting', 'Hello, I\'m server!');
    });

    // Send event "id" to the client
    client.send('id', client.id);
});

// Listen for disconnecting clients
server.addListener('client:leave', client => {
    console.log('Client %s left.', client.id);
});

module.exports = server;
