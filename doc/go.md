# Go port

Netcode server is also available in Golang.

It's fully compatible with the netcode browser client.

## Current features

- [x] Server
- [x] Sockets (equivalent of Client / Client Directory)
- [x] Binary encoder
- [ ] Json encoder
- [x] Packaged codecs (compatible with javascript codec)
- [x] Beacon (ping at regular interval)

## Notes

Netcode in golang is relying on [github.com/gorilla/websocket](github.com/gorilla/websocket) for Websocket implementation.
