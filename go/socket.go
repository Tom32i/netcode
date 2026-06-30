package netcode

import (
	"context"
	"github.com/coder/websocket"
	"time"
)

func CreateSocket(id uint, c *websocket.Conn, encoder *BinaryEncoder, in chan SocketMessage) *Socket {
	return &Socket{ID: id, Conn: c, Encoder: encoder, In: in}
}

type Socket struct {
	ID          uint
	Conn        *websocket.Conn
	Encoder     *BinaryEncoder
	In          chan SocketMessage
	readTimeout time.Duration
}

type SocketMessage struct {
	Socket  *Socket
	Message *Message
	Err     error
}

// SetReadTimeout bounds how long Run waits for an incoming message before
// treating the connection as dead. Zero (the default) disables the deadline.
func (s *Socket) SetReadTimeout(d time.Duration) {
	s.readTimeout = d
}

func (s *Socket) Send(message *Message) {
	data, err := s.Encoder.Encode(message)

	if err == nil {
		s.Write(data)
	}
}

func (s *Socket) Write(data []byte) {
	s.Conn.Write(context.Background(), websocket.MessageBinary, data)
}

// Ping sends a ping frame and waits for the pong, blocking until it arrives or
// the connection fails. Prefer PingContext to bound the wait.
func (s *Socket) Ping() error {
	return s.Conn.Ping(context.Background())
}

// PingContext sends a ping frame and waits for the pong, returning early if ctx
// is cancelled or its deadline elapses.
func (s *Socket) PingContext(ctx context.Context) error {
	return s.Conn.Ping(ctx)
}

func (s *Socket) Close(code int, reason string) error {
	return s.Conn.Close(websocket.StatusCode(code), reason)
}

// CloseNow closes the connection immediately without a close handshake. Use it
// for a peer already known to be unresponsive, where waiting for a handshake
// reply would only stall.
func (s *Socket) CloseNow() error {
	return s.Conn.CloseNow()
}

func (s *Socket) Run(onClose func(*Socket)) {
	defer func() {
		s.Close(int(websocket.StatusNormalClosure), "Done.")
		onClose(s)
	}()

	for {
		ctx, cancel := s.readContext()
		_, data, err := s.Conn.Read(ctx)
		cancel()

		if err != nil {
			return
		}

		s.Handle(data)
	}
}

// readContext returns the context governing a single Read: bounded by
// readTimeout when set, otherwise a plain cancellable background context.
func (s *Socket) readContext() (context.Context, context.CancelFunc) {
	if s.readTimeout <= 0 {
		return context.WithCancel(context.Background())
	}

	return context.WithTimeout(context.Background(), s.readTimeout)
}

func (s *Socket) Handle(data []byte) {
	message, err := s.Encoder.Decode(data)
	s.In <- SocketMessage{s, message, err}
}
