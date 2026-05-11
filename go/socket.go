package netcode

import (
	"context"
	"github.com/coder/websocket"
)

func CreateSocket(id uint, c *websocket.Conn, encoder *BinaryEncoder, in chan SocketMessage) *Socket {
	return &Socket{id, c, encoder, in}
}

type Socket struct {
	ID      uint
	Conn    *websocket.Conn
	Encoder *BinaryEncoder
	In      chan SocketMessage
}

type SocketMessage struct {
	Socket  *Socket
	Message *Message
	Err     error
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

func (s *Socket) Ping() error {
	return s.Conn.Ping(context.Background())
}

func (s *Socket) Close(code int, reason string) error {
	return s.Conn.Close(websocket.StatusCode(code), reason)
}

func (s *Socket) Run(onClose func(*Socket)) {
	defer func() {
		s.Close(int(websocket.StatusNormalClosure), "Done.")
		onClose(s)
	}()

	for {
		_, data, err := s.Conn.Read(context.Background())

		if err != nil {
			return
		}

		s.Handle(data)
	}
}

func (s *Socket) Handle(data []byte) {
	message, err := s.Encoder.Decode(data)
	s.In <- SocketMessage{s, message, err}
}
