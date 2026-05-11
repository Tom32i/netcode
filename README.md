Netcode
=======

> A simple JavaScript client & server binary-encoded websocket communication system aimed towards web video games development.

Features:
- 🔌 Server / Client duo, for node and the browser, that handle Websocket connection and communication.
- ⚡️ Handle the binary encoding and decoding of your data, with performances in mind.
- 📢 Listen for event dispatched over websocket with simple `on`/`off` event emitter system.
- 💬 Fallback to JSON for easy debugging.
- 🐹 [Golang server port available](doc/go.md), wire-compatible with the JavaScript client.

## Requirements

- Node >= v24.0.0

## Installation

`npm add netcode`

## Get started

### Define a list of events

The server and the client __must__ share the same ordered list of events.
An event is defined by its _unique_ name and the corresponding codec, responsible for encoding and decoding the data.

```javascript
// events.js
import { UInt8Codec, StringCodec } from 'netcode/encoder';

export default [
	['id', new UInt8Codec()],
	['say', new StringCodec()],
];
```

In this example, the event list define how to send the following events over websocket:

- `client.send('id', 255);`
- `client.send('say', 'Hello world!');`

Then you'll be able to listen for these events on the client as follow:

- `client.on('id', id => { /* Do something */ });`
- `client.on('say', sentence => { /* Do something */ });`

Now let's create a server and a client that use this event list.

### Setup a Server

We setup a server specifying the port and host on which the server will listen and the type of encoder to use.
Here we use a BinaryEncoder to communicate in binary over websocket, with the previously configured event list.

```javascript
import { Server, BinaryEncoder } from 'netcode/server';
import events from './events';

// Listen on localhost:8080
const server = new Server(8080, 'localhost', new BinaryEncoder(events));

server.on('client:join', client => {
	client.on('say', sentence => console.log(sentence));
	client.send('id', client.id);
});
```

Now we've got a server running at `localhost:8080` that listens for a `say` text event and sends an `id` integer event to every client that connects.

_See a [full example of server setup](demo/server.js)._

### Write a Client

Now we write a client, for the browser, that connects to our running server on `ws://localhost:8080` and use a BinaryEncoder with the same event list as the server.

```javascript
import { Client, BinaryEncoder } from 'netcode/client';
import events from './events';

const client = new Client('ws://localhost:8080', new BinaryEncoder(events))

client.on('open', () => {
	client.on('id', id => console.log(`My id is ${id}.`));
	client.send('say', 'Hello world!');
});
```

Now we've got a client that listens for the `id` event and sends a sentence in a `say` event.

Connection is alive and well!

_See a [full example of client setup](demo/client.js)._

## Complete documentation

To go further, see in-depth documentation and how-to's.

- [Full API reference](doc/API.md).
- [Default codecs and how to write your own](doc/codecs.md).
- [About packaging and setting up your own bundler configuration](doc/packaging.md).
- [Use netcode over a custom domain name and/or secured SSL connection](doc/ssl.md).
- [Run a Netcode server in Go](doc/go.md).
