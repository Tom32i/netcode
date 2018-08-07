const { Server } = require('./dist/netcode-server');

const server = new Server(process.argv[2]);

server.addListener('client:join', client => {
    console.log('Client %s joined', client.id);

    client.addListener('ping', ping => {
        console.log('Client %s ping received: %s', client.id, ping);
        client.send('pong', { ping, pong: Date.now() });
    });

    client.send('id', client.id);
});

module.exports = server;
