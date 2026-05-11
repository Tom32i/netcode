## Server

### Constructor

The `Server` class takes the following arguments:

| Parameter      | Type                            | Default value              | Description                                                |
| -------------- | ------------------------------- | -------------------------- | ---------------------------------------------------------- |
| `port`         | _Number_                        | `8080`                     | Port to listen on.                                         |
| `host`         | _String_                        | `'0.0.0.0'`                | Host to listen on.                                         |
| `encoder`      | _BinaryEncoder \| JsonEncoder_  | `new JsonEncoder()`        | Encoder used to read/write event messages.                 |
| `pingInterval` | _Number_                        | `30`                       | Ping frequency in seconds (`0` to disable pings).          |
| `maxPayload`   | _Number_                        | `512`                      | Packet max length in bytes (should be a power of two).     |
| `clients`      | _ClientDirectory_               | `new MapClientDirectory()` | Client directory.                                          |
| `autoStart`    | _Boolean_                       | `true`                     | Whether the server should start listening immediately.     |

### Methods

#### `start()`

Start listening for clients. Called automatically by the constructor unless `autoStart` is `false`.

#### `on(name, callback)`

Listen for an event.

- `name {String}` The name of the event to listen to.
- `callback {Function}` The callback to execute when the event occurs.

#### `off(name, callback)`

Remove the listener for this event/callback.

### Events

| Name          | Callback parameters | Description                                          |
| ------------- | ------------------- | ---------------------------------------------------- |
| `ready`       |                     | Server is listening and ready to accept connections. |
| `client:join` | `client` _Client_   | New connected client.                                |
| `client:leave`| `client` _Client_   | Client left.                                         |
| `error`       | `error` _Error_     | An error occurred.                                   |

## Client

### Methods

#### `send(name, data)`

Send data to the other end of the WebSocket.

- `name {String}` The name of the event (must be one from the list passed to the BinaryEncoder).
- `data {Number|String|Boolean|Object}` Any data handled by the corresponding Codec.

#### `close(code, reason)`

Close the connection.

- `code {Number}` Optional [WebSocket close code](https://www.rfc-editor.org/rfc/rfc6455.html#section-7.4.1).
- `reason {String}` Optional [close reason](https://www.rfc-editor.org/rfc/rfc6455.html#section-7.1.6).

#### `on(name, callback)`

Listen for an event.

- `name {String}` The name of the event to listen to.
- `callback {Function}` The callback to execute when the event occurs.

#### `off(name, callback)`

Remove the listener for this event/callback.

### Events

| Name    | Callback parameters                                                              | Description                                                                                     |
| ------- | -------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------- |
| `open`  | `client` _Client_                                                                | Client connection is open and ready to transmit.                                                |
| `error` | `error` _Error_, `client` _Client_                                               | An error occurred.                                                                              |
| `close` | `client` _Client_                                                                | Client connection is closed.                                                                    |
| `*`     | `eventData` _Number \| String \| Boolean \| Object_, `client` _Client_           | Every event sent through the websocket pipe will emit an event on the other end of the socket. |

_Note: `open`, `error` and `close` are reserved event names; the Encoder will throw an exception if you define a custom event with either of these names._
