const { Server, BinaryEncoder, Codec, Int16Codec, LongIntCodec, BooleanCodec, StringCodec } = require('./dist/netcode-server');
const encoder = new BinaryEncoder([
    ['open', new Codec()],
    ['id', new Int16Codec()],
    ['ping', new LongIntCodec(6)],
    ['pong', new LongIntCodec(6)],
    ['inverse', new BooleanCodec()],
    ['greeting', new StringCodec()],
]);
const server = new Server(process.argv[2], 'localhost', encoder);

server.addListener('client:join', client => {
    console.log('Client %s joined.', client.id);

    client.addListener('ping', ping => {
        client.send('pong', Date.now());
        console.log('Client %s ping received: %s.', client.id, ping);
        client.send('inverse', true);
    });

    client.addListener('inverse', status => {
        console.log('Client %s inverse received: %s.', client.id, status);
    });

    client.addListener('greeting', message => {
        console.log('Client %s geets you: "%s"', client.id, message);
        client.send('greeting', 'Hello, I\'m server!');
    });

    client.send('id', client.id);
});

server.addListener('client:leave', client => {
    console.log('Client %s left.', client.id);
});

module.exports = server;
