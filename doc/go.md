# Go port

A Golang implementation of the Netcode server.

It is fully compatible with the JavaScript Netcode browser client: a Go server and a JS client sharing the same event list will talk to each other over the same binary protocol.

## Features

- [x] Server
- [x] Sockets (equivalent to Client / ClientDirectory in the JS implementation)
- [x] Binary encoder
- [ ] JSON encoder
- [x] Packaged codecs (compatible with the JavaScript codecs)
- [x] Beacon (ping at a regular interval)

## Installation

```sh
go get github.com/Tom32i/netcode/v3/go
```

Requires Go `>= 1.23`.

## Get started

The Go server is organized around four pieces:

- a `BinaryEncoder` that knows how to encode/decode your events,
- a `Sockets` registry that tracks connected clients and exposes `In`/`Out` channels,
- the `Start` function that opens the WebSocket endpoint,
- an optional `Beacon` that pings a socket at a regular interval to measure latency.

### Define your events

The server and the client **must** share the same ordered list of events. Each event is defined by a unique name and a codec.

```go
encoder := netcode.CreateBinaryEncoder([]*netcode.RegisteredCodec{
    {0, "id",   netcode.UInt8Codec{}},
    {0, "say",  netcode.StringCodec{}},
}, netcode.UInt8Codec{})
```

The second argument of `CreateBinaryEncoder` is the codec used to encode the event _id_ on the wire. Use `UInt8Codec{}` for up to 256 events; switch to `UInt16Codec{}` if you need more.

> The `Id` field of `RegisteredCodec` is assigned automatically from the slice index — the `0` placeholder is overwritten.

### Setup a server

```go
package main

import (
    "log"
    "math"
    "net/http"

    netcode "github.com/Tom32i/netcode/v3/go"
)

func main() {
    encoder := netcode.CreateBinaryEncoder([]*netcode.RegisteredCodec{
        {0, "id",  netcode.UInt8Codec{}},
        {0, "say", netcode.StringCodec{}},
    }, netcode.UInt8Codec{})

    sockets := netcode.CreateSockets(encoder, uint(math.Pow(2, 8)), 1)

    go func() {
        for {
            select {
            case m := <-sockets.In:
                log.Printf("[#%d] %s: %v", m.Socket.ID, m.Message.Name, m.Message.Data)
            case s := <-sockets.Out:
                log.Printf("[#%d] left", s.ID)
            }
        }
    }()

    netcode.Start(8080, "/", func(w http.ResponseWriter, r *http.Request, c *netcode.Conn) {
        socket, err := sockets.Add(c)
        if err != nil {
            log.Printf("rejected: %v", err)
            return
        }
        socket.Send(&netcode.Message{Name: "id", Data: uint8(socket.ID)})
    }, &netcode.AcceptOptions{
        InsecureSkipVerify: true,
        Subprotocols:       []string{"websocket"},
    })
}
```

A full working example lives at [`demo/server.go`](../demo/server.go). It can be run against the JavaScript browser client from [`demo/client.js`](../demo/client.js).

## API reference

### `Start(port, path, onSocket, acceptOptions)`

Starts an HTTP server on `:port`, accepts WebSocket connections on `path`, and calls `onSocket` for each successful upgrade. `acceptOptions` is forwarded to the underlying [`coder/websocket`](https://github.com/coder/websocket) `Accept` call — use it to configure subprotocols, origin checks, etc.

This call blocks; run it on the main goroutine.

### `BinaryEncoder`

| Function | Description |
| --- | --- |
| `CreateBinaryEncoder(codecs, idCodec)` | Build an encoder from an ordered list of `RegisteredCodec` and the codec used for the event id. |
| `Encode(message *Message) ([]byte, error)` | Encode a message to bytes. Returns `ErrCodecNotFound` if the event name is unknown. |
| `Decode(data []byte) (*Message, error)` | Decode bytes to a message. Returns `ErrCodecNotFound` if the id is unknown. |

A `Message` is a `{ Name string; Data any }` pair. The concrete type held in `Data` depends on the codec — see the table below.

### `Sockets`

A thread-safe registry of connected sockets that also dispatches incoming messages.

| Field / Method | Description |
| --- | --- |
| `In chan SocketMessage` | Receives every decoded incoming message. A `SocketMessage` carries the source `Socket`, the `Message` and a decoding `Err`. |
| `Out chan *Socket` | Receives a socket whenever it disconnects. |
| `Add(c *Conn) (*Socket, error)` | Register a new connection. Returns an error when the maximum count is reached. |
| `Count() int` | Number of connected sockets. |
| `ForEach(fn)` / `ForOther(socket, fn)` | Iterate over all sockets, optionally skipping one. |
| `Send(socket, message)` | Encode and send a message to a single socket. |
| `SendAll(message)` | Encode once and broadcast to every socket. |
| `SendOther(socket, message)` | Encode once and broadcast to every socket but the given one. |
| `WriteAll(data)` / `WriteOther(socket, data)` | Same as above but with pre-encoded bytes (useful when broadcasting an identical payload). |
| `Clear()` | Close the `In` and `Out` channels. |

### `Socket`

| Field / Method | Description |
| --- | --- |
| `ID uint` | Unique id assigned by the `Sockets` registry. |
| `Send(message *Message)` | Encode and send a message. |
| `Write(data []byte)` | Send pre-encoded bytes. |
| `Ping() error` | Send a WebSocket ping. |
| `Close(code int, reason string) error` | Close the connection. |

### `Beacon`

Periodically pings a socket and reports the round-trip duration.

```go
b := netcode.CreateBeacon(socket, 3*time.Second, func(ping time.Duration) {
    log.Printf("client #%d ping: %v", socket.ID, ping)
})
defer b.Destroy()
```

`Start`, `Stop` and `Destroy` control the underlying ticker.

## Codecs

The following packaged codecs are available. They are wire-compatible with their JavaScript counterparts.

| Codec | Go type | Size (byte) |
| --- | --- | --- |
| `NullCodec` | `nil` | 0 |
| `BooleanCodec` | `bool` | 1 |
| `UInt8Codec` | `uint8` | 1 |
| `UInt16Codec` | `uint16` | 2 |
| `UInt32Codec` | `uint32` | 4 |
| `UInt64Codec` | `uint64` | 8 |
| `UIntLongCodec{N}` | `uint` | N |
| `Int8Codec` | `int8` | 1 |
| `Int16Codec` | `int16` | 2 |
| `Int32Codec` | `int32` | 4 |
| `Int64Codec` | `int64` | 8 |
| `Float32Codec` | `float32` | 4 |
| `Float64Codec` | `float64` | 8 |
| `CreateFloatPrecisionCodec[F, I](intCodec, precision)` | `float32`/`float64` encoded as an int | size of `intCodec` |
| `StringCodec` | `string` (up to 255 bytes) | 1 + N |
| `StringLongCodec` | `string` (up to 65535 bytes) | 2 + N |

> When reading from a `Message.Data`, type-assert with the codec's Go type — for example `m.Data.(uint8)` or `m.Data.(string)`.

### Custom codecs

Any type implementing the `Codec` interface can be registered:

```go
type Codec interface {
    Encode(buffer *bytes.Buffer, data any)
    Decode(buffer *bytes.Buffer) any
}
```

You can build composite codecs by delegating to the packaged ones — see how `FloatPrecisionCodec` is implemented for a reference.

## Errors

| Sentinel | Meaning |
| --- | --- |
| `ErrCodecNotFound` | The event name (when encoding) or id (when decoding) is not registered on this encoder. |
| `ErrInternal` | Unspecified internal error. |

Wrap with `errors.Is` to check.

## Notes

The WebSocket transport relies on [`github.com/coder/websocket`](https://github.com/coder/websocket).
