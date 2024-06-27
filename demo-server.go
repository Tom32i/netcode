package main

import (
	"flag"
	"log"
	"math"
	"github.com/Tom32i/netcode/internal/codec"
	"github.com/Tom32i/netcode/internal/server"
	"time"
)

type DemoServer struct {
	server *server.Server
}

func main() {
	port := flag.Int("port", 8002, "Port to run on")

	flag.Parse()

	encoder := codec.CreateBinaryEncoder([]*codec.RegisteredCodec{
		{0, "id", codec.UInt8Codec{}},
		{1, "ping", codec.LongUIntCodec{6}},
		{2, "pong", codec.LongUIntCodec{6}},
		{3, "inverse", codec.BooleanCodec{}},
		{4, "greeting", codec.StringLongCodec{}},
		{5, "total", codec.UInt8Codec{}},
	}, codec.UInt8Codec{})

	clients := server.CreateClientDirectory(uint(math.Pow(2, 8)))
	server := server.CreateServer(*port, encoder, clients)

	demo := DemoServer{&server}

	go demo.run()

	demo.server.Start()
}

func (demo *DemoServer) run() {
	log.Printf("Demo is running")
	for {
		select {
		case m := <-demo.server.In:
			switch m.Message.Name {
			case "ping":
				demo.handlePing(m.Client, m.Message)
			case "greeting":
				demo.handleGreeting(m.Client, m.Message)
			default:
				log.Printf("[client #%d] '%s': %v", m.Client.ID, m.Message.Name, m.Message.Data)
			}
		case e := <-demo.server.Out:
			switch e.Name {
			case "client:join":
				demo.onClientJoin(e.Data.(*server.Client))
			case "client:leave":
				demo.onClientLeave(e.Data.(*server.Client))
			default:
				log.Printf("event '%s': %v", e.Name, e.Data)
			}
		}
	}
}

func (demo *DemoServer) broadcastTotal() {
	message := codec.Message{"total", uint8(demo.server.Clients.Count())}
	buf := demo.server.Encoder.Encode(message)
	demo.server.Clients.ForEach(func(c *server.Client) { c.Write(buf) })
}

func (demo *DemoServer) onClientJoin(c *server.Client) {
	log.Printf("Client #%d joined.", c.ID)
	c.Send(codec.Message{"id", uint8(c.ID)})
	demo.broadcastTotal()
}

func (demo *DemoServer) onClientLeave(c *server.Client) {
	log.Printf("Client #%d left.", c.ID)
	demo.broadcastTotal()
}

func (demo *DemoServer) handlePing(c *server.Client, m codec.Message) {
	log.Printf("[client #%d] ping %d", c.ID, m.Data)
	c.Send(codec.Message{"pong", uint(time.Now().UnixMilli())})
	c.Send(codec.Message{"inverse", true})
}

func (demo *DemoServer) handleGreeting(c *server.Client, m codec.Message) {
	log.Printf("Client #%d greets you: '%s'", c.ID, m.Data)
	c.Send(codec.Message{"greeting", "Hello, I'm server! 😊 Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut imperdiet molestie libero, ut sollicitudin tortor dignissim quis. Nulla iaculis nisi turpis, a malesuada nibh faucibus a. Nunc tellus lorem, varius sit amet tellus eu, dictum consectetur nulla."})
}
