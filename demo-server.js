const { Server, BinaryEncoder, Handler, Int16Handler, TimeStampHandler, BooleanHandler } = require('./dist/netcode-server');
const encoder = new BinaryEncoder([
    new Handler('open'),
    new Int16Handler('id'),
    new TimeStampHandler('ping'),
    new TimeStampHandler('pong'),
    new BooleanHandler('inverse'),
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

    client.send('id', client.id);
});

server.addListener('client:leave', client => {
    console.log('Client %s left.', client.id);
});

module.exports = server;
