const { Server, BinaryEncoder, Handler, Int16Handler, TimeStampHandler } = require('./dist/netcode-server');
const encoder = new BinaryEncoder([
    new Handler('open'),
    new Int16Handler('id'),
    new TimeStampHandler('ping'),
    new TimeStampHandler('pong'),
]);
const server = new Server(process.argv[2], 'localhost', encoder);

server.addListener('client:join', client => {
    console.log('Client %s joined', client.id);

    client.addListener('ping', ping => {
        client.send('pong', Date.now());
        console.log('Client %s ping received: %s', client.id, ping);
    });

    client.send('id', client.id);
});

module.exports = server;
