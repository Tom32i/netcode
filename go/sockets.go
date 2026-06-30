package netcode

import (
	"errors"
	"github.com/coder/websocket"
	"log"
	"sync"
	"time"
)

func CreateSockets(encoder *BinaryEncoder, maxId uint, inBufferSize int) *Sockets {
	return &Sockets{
		Encoder: encoder,
		In:      make(chan SocketMessage, inBufferSize),
		Out:     make(chan *Socket, 1),
		List:    make(map[uint]*Socket),
		maxId:   maxId,
	}
}

type Sockets struct {
	Encoder     *BinaryEncoder
	In          chan SocketMessage
	Out         chan *Socket
	List        map[uint]*Socket
	maxId       uint
	readTimeout time.Duration
	mu          sync.RWMutex
}

// SetReadTimeout sets the read deadline applied to every socket created from
// here on. Zero (the default) disables the deadline.
func (ss *Sockets) SetReadTimeout(d time.Duration) {
	ss.readTimeout = d
}

func (ss *Sockets) generateId() (uint, error) {
	for id := uint(0); id < ss.maxId; id++ {
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

	socket := CreateSocket(id, c, ss.Encoder, ss.In)
	socket.SetReadTimeout(ss.readTimeout)

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
