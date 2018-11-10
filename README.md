Netcode
=======

A simple JavaScript client & server binary-encoded websocket communication system for web video games.

## Installation

`npm add netcode`

## Requirements

- Node >= v8.0.0

## Usage

### Define an encoder (common to server and client)

The server and the client __must__ share the same events.
An events is defined by its _unique_ name and the corresponding codec, responsible for encoding and decoding the data.

```javascript
// events.js
import Int8Codec from 'netcode/src/encoder/codec/Int8Codec';
import StringCodec from 'netcode/src/encoder/codec/StringCodec';

export default [
    ['id', new Int8Codec()],
    ['say', new StringCodec()],
];
```

These encoder configuration allow you to send the following events over websocket:

- `send('id', 255);`
- `send('say', 'Hello world!');`

### Setup a Server (server-side / node)

We setup a server specifying the port and host that should be listen on and the encoder to use. Here we use a BinaryEncoder to communicate in binary over websocket, with the previously configured event list.

```javascript
import Server from 'netcode/src/server/Server';
import BinaryEncoder from 'netcode/src/server/BinaryEncoder';
import events from './envents';

// Listen on ws://localhost:8080
const server = new Server(8080, 'localhost', new BinaryEncoder(events));

server.on('client:join', client => {
    client.on('say', sentence => console.log(sentence));
    client.send('id', client.id);
});
```

Now we've got a server running at `ws://localhost:8080/` that listen for a `say` text event and send a `id` integer event to every client that connects.

Server parameters:

| Parameter | Type                           | Default value     | Description                                          |
| --------- | ------------------------------ | ----------------- | ---------------------------------------------------- |
| port      | _Number_                       | 8080              | Port to listen on.                                   |
| host      | _String_                       | 0.0.0.0           | Host to listen on.                                   |
| encoder   | _BinaryEncoder \| JsonEncoder_ | new JsonEncoder() | Encoder to use to read/write event messages.         |
| ping      | _Number_                       | 30                | Ping frequency in seconds (0 for no ping).           |
| maxLength | _Number_                       | 512               | Paquet max length in bit (should be a power of two). |
| protocols | _Array String[]_               | `['websocket']`   | Protocols tu use                                     |

_See an [full example of server setup](demo-server.js)._

### Write a Client (browser side)

Now we write a client for the browser that connects to `localhost:8080` and use a BinaryEncoder with the same event configuration as the server.

```javascript
import Client from 'netcode/src/client/Client';
import BinaryEncoder from 'netcode/src/client/BinaryEncoder';
import events from './envents';

const client = new Client('localhost:8080', new BinaryEncoder(events))

client.on('open', () => {
    client.on('id', id => console.log(`My id is ${id}.`));
    client.send('say', 'Hello world!');
});
```

Now we've got client that listen for the `id` event and sent a sentence in a `say` event.

Connection is alive and well!

_See an [full example of client setup](demo-client.js)._

## Events

You can interface your code with the Server and both Client objects through the designated events and the `on(event, callback)` and `off(event, callback)` methods.

_Note: If you're on node `< 10.0.0`, use `removeListener` method instead of `off`_

__Server events:__

| Name | Callback parameters | Description |
|---|---|---|
| `ready` |  | Server is listening and ready to accept connections. |
| `client:join` | client _Client_ | New connected client. |
| `client:leave` | client _Client_ | Client left. |
| `error` | error _Error_ | An error occured. |

__Client events:__

| Name | Callback parameters | Description |
|---|---|---|
| `open` | client _Client_ | Client connection is open and ready to transmit. |
| `error` | error _Error_, client _Client_ | An error occurred. |
| `close` | client _Client_ | Client connection is closed. |

## Codecs

Codecs are responsible for encoding your events data into ArrayBuffer that will be transmitted over the binary websocket connection and decoded back into usable data on the other side.

You will probably need to write your own codecs but a few standard needs are alreay adressed by the simple codecs that follow:

###Packaged codecs

Packaged codecs are available in the `netcode/server` and `netcode/client` packages or as source code in  `netcode/src/encoder/codec` folder (see [Note on packaging](#Note on packaging))

| Class                      | Data format                        | Example                                                      | Size (in byte)          |
| -------------------------- | ---------------------------------- | ------------------------------------------------------------ | ----------------------- |
| `Codec`                    | No data (just send the event name) | `['pause', new Codec()]`<br />`send('pause')`                | 0                       |
| `BooleanCodec`             | `true|false`                       | `['active', new BooleanCodec()]`<br />`send('active', true)` | 1                       |
| `StringCodec`              | String up to 255 characters        | `['player:name', new StringCodec()]`<br />`send('player:name', 'DarkShadow73')` | 1 + (String length * 2) |
| `LongStringCodec`          | String up to 65536 characters      | `['url', new LongStringCodec()]`<br />`send('url', 'https://my.long.url/hash/xxx...')` | 2 + (String length * 2) |
| `Int8Codec`                | Integer from 0 to 255              | `['id', new Int8Codec()]`<br />`send('id', 42)`              | 1                       |
| `Int16Codec`               | Integer from 0 to 65536            | `['score', new Int16Codec()]`<br />`send('score', 9999)`     | 2                       |
| `Int32Codec`               | Integer from 0 to 4294967295       | `['position', new Int32Codec()]`<br />`send('position', 4294967295)` | 4                       |
| `LongIntCodec(byteLength)` | Integer encoded as string          | `['timestamp', new LongIntCodec(13)`]<br />`send('timestamp', Date.now())` | byteLength              |

## Note on packaging

Netcode provides you with 2 pre-packaged versions of the library for Node and for the Browser, so you can use it out of the box. You can also import the ES6 source code directly and manage the packaging yourself.

Let's see an example of both these setups:

### Using the pre-packaged libraries
On the server-side (node):

```javascript
const {
	Server,
	BinaryEncoder,
	Int16Codec,
	BooleanCodec,
	StringCodec,
	// ...
} = require('netcode/server');`
```

And in the browser as well:

```html
<body>
	<!-- Defines a netcode variable in global scope -->
    <script src="node_modules/netcode/client.js"></script>
    <script>
        const {
            Client,
            BinaryEncoder,
            Int16Codec,
            BooleanCodec,
            StringCodec,
			// ...
        } = netcode;
    </script>
</body>
```

### Using the ES6 source code

In your Webpack configuration, include the source code of Netcode so that Babel will compile this ES6 code as well.

```javascript
module.exports = {
  //...
  module: {
    rules: [{
      // ...
      include: '/node_modules/netcode/src/',
    }]
  }
};
```

_See a [full Webpack/Babel config example](doc/webpack.config.js)._

Now you can import source file from Netcode directly in your code and it will be compiled as well :

```javascript
// src/server.js
import Server from 'netcode/src/server/Server';
import BinaryEncoder from 'netcode/src/server/BinaryEncoder'; // Import from src/server!
import BooleanCodec from 'netcode/src/encoder/codec/BooleanCodec';

new Server(
	8080,
	'localhost',
	new BinaryEncoder([
        ['foo', new BooleanEncoder()]
	])
);
```

```javascript
// src/client.js
import Client from 'netcode/src/client/Client';
import BinaryEncoder from 'netcode/src/client/BinaryEncoder'; // Import from src/client!
import BooleanCodec from 'netcode/src/encoder/codec/BooleanCodec';

new Client(
	'ws://localhost:8080',
	new BinaryEncoder([
		['foo', new BooleanCodec()]
	])
);
```

## Debugging

The BinaryEncoder should emit errors if anything wrong happen durring encoding or decoding, but even so, working with binary data can be tricky.
You can replace your `BinaryEncoder` with a `JsonEncoder` at any time without any other change to you code to switch to a JSON communication and to help you find out what's wrong with transmitted data.