package netcode

import (
	"errors"
	"github.com/gorilla/websocket"
	"log"
	"sync"
)

func CreateSockets(encoder *BinaryEncoder, max uint) *Sockets {
	return &Sockets{
		Encoder: encoder,
		In:      make(chan SocketMessage),
		Out:     make(chan *Socket),
		List:    make(map[uint]*Socket),
		max:     max,
	}
}

type Sockets struct {
	Encoder *BinaryEncoder
	In      chan SocketMessage
	Out     chan *Socket
	List    map[uint]*Socket
	max     uint
	mu      sync.RWMutex
}

func (ss *Sockets) generateId() (uint, error) {
	for id := uint(0); id < ss.max; id++ {
		ss.mu.RLock()
		_, ok := ss.List[id]
		ss.mu.RUnlock()

		if !ok {
			return id, nil
		}
	}

	return uint(0), errors.New("Socket limit reached!")
}

func (ss *Sockets) Add(c *websocket.Conn) (*Socket, error) {
	id, err := ss.generateId()

	if err != nil {
		return nil, err
	}

	socket := &Socket{
		ID:      id,
		Conn:    c,
		Encoder: ss.Encoder,
		In:      ss.In,
	}

	ss.mu.Lock()
	ss.List[socket.ID] = socket
	ss.mu.Unlock()

	go socket.Run(ss.Remove)

	return socket, nil
}

func (ss *Sockets) Remove(socket *Socket) {
	ss.mu.Lock()
	delete(ss.List, socket.ID)
	ss.mu.Unlock()

	ss.Out <- socket
}

func (ss *Sockets) Count() int {
	return len(ss.List)
}

func (ss *Sockets) ForEach(callback func(*Socket)) {
	ss.mu.RLock()
	defer ss.mu.RUnlock()

	for _, s := range ss.List {
		callback(s)
	}
}

func (ss *Sockets) ForOther(socket *Socket, callback func(*Socket)) {
	ss.mu.RLock()
	defer ss.mu.RUnlock()

	for _, s := range ss.List {
		if s.ID != socket.ID {
			callback(s)
		}
	}
}

func (ss *Sockets) WriteAll(data []byte) {
	ss.mu.RLock()
	defer ss.mu.RUnlock()

	for _, c := range ss.List {
		c.Write(data)
	}
}

func (ss *Sockets) WriteOther(socket *Socket, data []byte) {
	ss.mu.RLock()
	defer ss.mu.RUnlock()

	for _, s := range ss.List {
		if s.ID != socket.ID {
			s.Write(data)
		}
	}
}

func (ss *Sockets) Send(socket *Socket, message *Message) {
	bytes, err := ss.Encoder.Encode(message)
	if err == nil {
		socket.Write(bytes)
	} else {
		log.Printf("Error: %v", err)
	}
}

func (ss *Sockets) SendAll(message *Message) {
	bytes, err := ss.Encoder.Encode(message)
	if err == nil {
		ss.WriteAll(bytes)
	} else {
		log.Printf("Error: %v", err)
	}
}

func (ss *Sockets) SendOther(socket *Socket, message *Message) {
	bytes, err := ss.Encoder.Encode(message)
	if err == nil {
		ss.WriteOther(socket, bytes)
	} else {
		log.Printf("Error: %v", err)
	}
}

func (ss *Sockets) Clear() {
	close(ss.In)
	close(ss.Out)
}
