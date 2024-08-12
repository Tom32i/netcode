package main

import (
	"flag"
	netcode "github.com/Tom32i/netcode/go"
	"github.com/gorilla/websocket"
	"log"
	"math"
	"net/http"
	"time"
)

type Demo struct {
	sockets *netcode.Sockets
}

func main() {
	port := flag.Int("port", 8002, "Port to run on")

	flag.Parse()

	encoder := netcode.CreateBinaryEncoder([]*netcode.RegisteredCodec{
		{0, "id", netcode.UInt8Codec{}},
		{1, "ping", netcode.UIntLongCodec{6}},
		{2, "pong", netcode.UIntLongCodec{6}},
		{3, "inverse", netcode.BooleanCodec{}},
		{4, "greeting", netcode.StringLongCodec{}},
		{5, "total", netcode.UInt8Codec{}},
	}, netcode.UInt8Codec{})

	demo := Demo{
		netcode.CreateSockets(encoder, uint(math.Pow(2, 8))),
	}

	go demo.run()

	netcode.Start(*port, "/", func(conn *websocket.Conn, request *http.Request) {
		socket, err := demo.sockets.Add(conn)

		if err != nil {
			log.Fatal(err)
		}

		netcode.CreateBeacon(socket, time.Second*3, func(ping time.Duration) {
			log.Printf("Client #%d ping: %s.", socket.ID, ping)
		})

		demo.onClientJoin(socket)
	})
}

func (demo *Demo) run() {
	log.Printf("Demo is running")
	for {
		select {
		case m := <-demo.sockets.In:
			switch m.Message.Name {
			case "ping":
				demo.handlePing(m.Socket, m.Message)
			case "greeting":
				demo.handleGreeting(m.Socket, m.Message)
			default:
				log.Printf("[socket #%d] '%s': %v", m.Socket.ID, m.Message.Name, m.Message.Data)
			}
		case socket := <-demo.sockets.Out:
			demo.onClientLeave(socket)
			// switch e.Name {
			// case "socket:join":
			// 	demo.onClientJoin(e.Data.(*netcode.Socket))
			// case "socket:leave":
			// 	demo.onClientLeave(e.Data.(*netcode.Socket))
			// default:
			// 	log.Printf("event '%s': %v", e.Name, e.Data)
			// }
		}
	}
}

func (demo *Demo) broadcastTotal() {
	demo.sockets.SendAll(
		&netcode.Message{"total", uint8(demo.sockets.Count())},
	)
}

func (demo *Demo) onClientJoin(s *netcode.Socket) {
	log.Printf("Client #%d joined.", s.ID)
	s.Send(&netcode.Message{"id", uint8(s.ID)})
	demo.broadcastTotal()
}

func (demo *Demo) onClientLeave(s *netcode.Socket) {
	log.Printf("Client #%d left.", s.ID)
	demo.broadcastTotal()
}

func (demo *Demo) handlePing(s *netcode.Socket, m *netcode.Message) {
	log.Printf("Client #%d ping: %d.", s.ID, m.Data)
	s.Send(&netcode.Message{"pong", uint(time.Now().UnixMilli())})
	s.Send(&netcode.Message{"inverse", true})
}

func (demo *Demo) handleGreeting(s *netcode.Socket, m *netcode.Message) {
	log.Printf("Client #%d greets you: '%s'.", s.ID, m.Data)
	s.Send(&netcode.Message{"greeting", "Hello, I'm server! 😊 Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut imperdiet molestie libero, ut sollicitudin tortor dignissim quis. Nulla iaculis nisi turpis, a malesuada nibh faucibus a. Nunc tellus lorem, varius sit amet tellus eu, dictum consectetur nulla."})
}
