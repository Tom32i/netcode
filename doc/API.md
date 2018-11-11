## Server

### Constructor

The `Server` class takes the following arguments:

| Parameter | Type                           | Default value     | Description                                          |
| --------- | ------------------------------ | ----------------- | ---------------------------------------------------- |
| port      | _Number_                       | 8080              | Port to listen on.                                   |
| host      | _String_                       | 0.0.0.0           | Host to listen on.                                   |
| encoder   | _BinaryEncoder \| JsonEncoder_ | new JsonEncoder() | Encoder to use to read/write event messages.         |
| ping      | _Number_                       | 30                | Ping frequency in seconds (0 for no ping).           |
| maxLength | _Number_                       | 512               | Paquet max length in bit (should be a power of two). |
| protocols | _Array String[]_               | `['websocket']`   | Protocols tu use                                     |

### Methods

#### on(name, callback)

Listen for event.

- `name {String}` The name of the event to listen to.
- `callback {Function}` The callback to execute when the event occure.


#### off(name, callback)

Remove listener for this event / callback.

_Note: If you're on node `< 10.0.0`, use `removeListener` method instead of `off`_

### Events

| Name | Callback parameters | Description |
|------|---------------------|---|
| `ready` |  | Server is listening and ready to accept connections. |
| `client:join` | client _Client_ | New connected client. |
| `client:leave` | client _Client_ | Client left. |
| `error` | error _Error_ | An error occured. |

## Client

### Methods

#### send(name, data)

Send data to the other end of the Websocket.

- `name {String}` The name of the event (must be one from the list passed to the BinaryEncoder).
- `data {Number|String|Boolean|Object}` Any data handled by the corresponding Codec.

#### close()

Close the connexion.

#### on(name, callback)

Listen for event.

- `name {String}` The name of the event to listen to.
- `callback {Function}` The callback to execute when the event occure.


#### off(name, callback)

Remove listener for this event / callback.

_Note: If you're on node `< 10.0.0`, use `removeListener` method instead of `off`_

### Events

| Name | Callback parameters | Description |
|---|---|---|
| `open` | client _Client_ | Client connection is open and ready to transmit. |
| `error` | - error _Error_<br />- client _Client_ | An error occurred. |
| `close` | client _{Client_} | Client connection is closed. |
| * | - eventData _{Number\|String\|Boolean\|Object}_<br />- client _Client_ | Every event sent through the websocket pipe will emit an event on the other end of the socket. |

_Note: `open`, `error` and `close` are reserved event names and the Encoder will throw an exeption if you define a custom event with either of these names._