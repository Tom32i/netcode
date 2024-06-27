package server

import (
	"github.com/Tom32i/netcode/internal/codec"
	// "encoding/json"
	"fmt"
	"github.com/gorilla/websocket"
	"log"
	"net/http"
)

type Server struct {
	port     int
	In       chan ClientMessage
	Out      chan Event
	upgrader *websocket.Upgrader
	Encoder  *codec.BinaryEncoder
	Clients  *ClientDirectory
}

type Event struct {
	Name string
	Data any
}

func (s *Server) Start() {
	//http.HandleFunc("/status", s.StatusHandler)
	http.HandleFunc("/", s.UpgradeHandler)

	log.Printf("Listening on port %d", s.port)
	err := http.ListenAndServe(fmt.Sprintf(":%d", s.port), nil)

	if err != nil {
		log.Fatal(err)
	}

	s.Out <- Event{"ready", nil}
}

// func (s *Server) StatusHandler(w http.ResponseWriter, r *http.Request) {
// 	var resp = StatusResponse{
// 		Rooms: make([]RoomResponse, 0),
// 	}

// 	log.Printf("%#v", len(s.rooms))

// 	for _, r := range s.rooms {
// 		resp.Rooms = append(resp.Rooms, RoomResponse{r.id, len(r.Clients)})
// 	}

// 	body, err := json.Marshal(resp)

// 	if err != nil {
// 		log.Fatalf("Error happened in JSON marshal. Err: %s", err)
// 	}

// 	w.Header().Set("Access-Control-Allow-Origin", "*")
// 	w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
// 	w.Header().Set("Access-Control-Allow-Headers", "Authorization, Content-Type, Accept-Encoding, Cache-Control")
// 	w.Header().Set("Access-Control-Allow-Credentials", "true")
// 	w.Header().Set("Content-Type", "application/json")
// 	w.Write(body)
// }

func (s *Server) UpgradeHandler(w http.ResponseWriter, r *http.Request) {
	log.Printf("Upgrading connexion")

	//id := r.URL.Query().Get("id")
	//token := r.URL.Query().Get("token")
	ip := s.getIp(r)

	socket, err := s.upgrader.Upgrade(w, r, nil)
	if err != nil {
		log.Println(err)
		return
	}

	c := &Client{
		IP:      ip,
		socket:  socket,
		encoder: s.Encoder,
		in:      s.In,
	}

	s.Clients.Add(c)

	go c.run(func(c *Client) {
		s.Clients.Remove(c)
		s.Out <- Event{"client:leave", c}
	})

	s.Out <- Event{"client:join", c}
}

func (s *Server) getIp(r *http.Request) string {
	if r.Header.Get("x-real-ip") != "" {
		return r.Header.Get("x-real-ip")
	}

	if r.Header.Get("X-Forwarded-For") != "" {
		return r.Header.Get("X-Forwarded-For")
	}

	return "unknown"
}

func errorHandler(w http.ResponseWriter, r *http.Request, status int, reason error) {
	log.Printf("Error: %v %v", status, reason)
}

func checkOrigin(r *http.Request) bool {
	return true
}

func CreateServer(port int, encoder *codec.BinaryEncoder, clients *ClientDirectory) Server {
	upgrader := &websocket.Upgrader{
		ReadBufferSize:  1024,
		WriteBufferSize: 1024,
		Subprotocols:    []string{"websocket"},
		Error:           errorHandler,
		CheckOrigin:     checkOrigin,
	}

	return Server{
		port:     port,
		Encoder:  encoder,
		Clients:  clients,
		upgrader: upgrader,
		In:       make(chan ClientMessage),
		Out:      make(chan Event),
	}
}
