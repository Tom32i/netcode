package main

import (
	"flag"
	"log"
	"math"
	netcode "github.com/Tom32i/netcode/go"
	"github.com/gorilla/websocket"
	"net/http"
	"time"
)

type Demo struct {
	room *netcode.Room
}

func main() {
	port := flag.Int("port", 8002, "Port to run on")

	flag.Parse()

	encoder := netcode.CreateBinaryEncoder([]*netcode.RegisteredCodec{
		{0, "id", netcode.UInt8Codec{}},
		{1, "ping", netcode.LongUIntCodec{6}},
		{2, "pong", netcode.LongUIntCodec{6}},
		{3, "inverse", netcode.BooleanCodec{}},
		{4, "greeting", netcode.StringLongCodec{}},
		{5, "total", netcode.UInt8Codec{}},
	}, netcode.UInt8Codec{})

	clients := netcode.CreateClientDirectory(uint(math.Pow(2, 8)))
	room := netcode.CreateRoom(clients, encoder)
	demo := Demo{room}

	go demo.run()

	netcode.Start(*port, "/", func (socket *websocket.Conn, request *http.Request) {
		err := room.Join(socket)

		if err != nil {
			log.Fatal(err)
		}
	})
}

func (demo *Demo) run() {
	log.Printf("Demo is running")
	for {
		select {
		case m := <-demo.room.In:
			switch m.Message.Name {
			case "ping":
				demo.handlePing(m.Client, m.Message)
			case "greeting":
				demo.handleGreeting(m.Client, m.Message)
			default:
				log.Printf("[client #%d] '%s': %v", m.Client.ID, m.Message.Name, m.Message.Data)
			}
		case e := <-demo.room.Out:
			switch e.Name {
			case "client:join":
				demo.onClientJoin(e.Data.(*netcode.Client))
			case "client:leave":
				demo.onClientLeave(e.Data.(*netcode.Client))
			default:
				log.Printf("event '%s': %v", e.Name, e.Data)
			}
		}
	}
}

func (demo *Demo) broadcastTotal() {
	message := &netcode.Message{"total", uint8(demo.room.Clients.Count())}
	buf := demo.room.Encoder.Encode(message)
	demo.room.Clients.ForEach(func(c *netcode.Client) { c.Write(buf) })
}

func (demo *Demo) onClientJoin(c *netcode.Client) {
	log.Printf("Client #%d joined.", c.ID)
	c.Send(&netcode.Message{"id", uint8(c.ID)})
	demo.broadcastTotal()
}

func (demo *Demo) onClientLeave(c *netcode.Client) {
	log.Printf("Client #%d left.", c.ID)
	demo.broadcastTotal()
}

func (demo *Demo) handlePing(c *netcode.Client, m *netcode.Message) {
	log.Printf("[client #%d] ping %d", c.ID, m.Data)
	c.Send(&netcode.Message{"pong", uint(time.Now().UnixMilli())})
	c.Send(&netcode.Message{"inverse", true})
}

func (demo *Demo) handleGreeting(c *netcode.Client, m *netcode.Message) {
	log.Printf("Client #%d greets you: '%s'", c.ID, m.Data)
	c.Send(&netcode.Message{"greeting", "Hello, I'm server! 😊 Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut imperdiet molestie libero, ut sollicitudin tortor dignissim quis. Nulla iaculis nisi turpis, a malesuada nibh faucibus a. Nunc tellus lorem, varius sit amet tellus eu, dictum consectetur nulla."})
}
