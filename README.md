Netcode
=======

A simple websocket communication system for web video games.
Based on `faye-websocket`.

## Installation

`npm add netcode`

## Usage

### Server side (node)

```
const { Server, BinaryEncoder, Handler, Int16Handler, TimeStampHandler } = require('netcode');

// Register your events
const encoder = new BinaryEncoder([
    new Handler('open'),
    new Int16Handler('id'),
    new TimeStampHandler('ping'),
    new TimeStampHandler('pong'),
]);

// Create the server
const server = new Server(8000, 'localhost', encoder);

// Listen for new clients
server.addListener('client:join', client => {
    console.log('Client %s joined', client.id);

    // Listen for "ping" event
    client.addListener('ping', ping => {
        client.send('pong', Date.now());
        console.log('Client %s ping received: %s', client.id, ping);
    });

    // Send the client it's ID
    client.send('id', client.id);
});

module.exports = server;
```

### Client side (browser)

```
const { Client, BinaryEncoder, Handler, Int16Handler, TimeStampHandler } = netcode;

// Register your events
const encoder = new BinaryEncoder([
    new Handler('open'),
    new Int16Handler('id'),
    new TimeStampHandler('ping'),
    new TimeStampHandler('pong'),
]);

// Create the client
const client = new Client('ws://localhost:8000', encoder);
let ping;

// Listen for "pong" event
client.addEventListener('pong', pong => {
    console.info('pong: %s ms', pong - ping);
});

// Listen for "id" event
client.addEventListener('id', id => {
    console.log('connected with id %s', id);
    ping = Date.now();

    // Send "ping" with current timestamp
    client.send('ping', ping);
});
```
