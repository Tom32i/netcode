package netcode

import (
	"github.com/gorilla/websocket"
	"log"
	"sync"
	"time"
)

type Socket struct {
	ID      uint
	In      chan SocketMessage
	Conn    *websocket.Conn
	Encoder *BinaryEncoder
	mu      sync.Mutex
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
	s.mu.Lock()
	defer s.mu.Unlock()
	s.Conn.WriteMessage(websocket.BinaryMessage, data)
}

func (s *Socket) Ping(message string) {
	s.mu.Lock()
	defer s.mu.Unlock()
	s.Conn.WriteControl(websocket.PingMessage, []byte(message), time.Now().Add(time.Second*5))
}

func (s *Socket) Pong(message string) {
	s.mu.Lock()
	defer s.mu.Unlock()
	s.Conn.WriteControl(websocket.PongMessage, []byte(message), time.Now().Add(time.Second*5))
}

func (s *Socket) Close(code int, message string) {
	s.mu.Lock()
	defer s.mu.Unlock()
	s.Conn.WriteControl(websocket.CloseMessage, websocket.FormatCloseMessage(code, message), time.Now().Add(time.Second*5))
}

func (s *Socket) Run(onClose func(*Socket)) {
	defer func() {
		s.Conn.Close()
		onClose(s)
	}()

	for {
		_, data, err := s.Conn.ReadMessage()

		if err != nil {
			if websocket.IsUnexpectedCloseError(err, websocket.CloseGoingAway, websocket.CloseNormalClosure) {
				log.Printf("Socket closed unexpectedly: %v", err)
			}
			return
		}

		go s.Handle(data)
	}
}

func (s *Socket) Handle(data []byte) {
	message, err := s.Encoder.Decode(data)
	s.In <- SocketMessage{s, message, err}
}
