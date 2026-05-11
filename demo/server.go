package main

import (
	"flag"
	netcode "github.com/Tom32i/netcode/go"
	"log"
	"math"
	"net/http"
	"time"
)

type Demo struct {
	sockets *netcode.Sockets
	beacons map[*netcode.Socket]*netcode.Beacon
}

func main() {
	port := flag.Int("port", 8002, "Port to run on")

	flag.Parse()

	encoder := netcode.CreateBinaryEncoder([]*netcode.RegisteredCodec{
		{0, "id", netcode.UInt8Codec{}},
		{0, "ping", netcode.UIntLongCodec{6}},
		{0, "pong", netcode.UIntLongCodec{6}},
		{0, "inverse", netcode.BooleanCodec{}},
		{0, "greeting", netcode.StringLongCodec{}},
		{0, "total", netcode.UInt8Codec{}},
		{0, "int16", netcode.Int16Codec{}},
	}, netcode.UInt8Codec{})

	d := Demo{
		netcode.CreateSockets(encoder, uint(math.Pow(2, 8)), 1),
		make(map[*netcode.Socket]*netcode.Beacon),
	}

	go d.run()

	netcode.Start(*port, "/", d.SocketHandler, &netcode.AcceptOptions{
		InsecureSkipVerify: true,
		Subprotocols:       []string{"websocket"},
	})
}

func (d *Demo) SocketHandler(w http.ResponseWriter, r *http.Request, c *netcode.Conn) {
	socket, err := d.sockets.Add(c)

	if err != nil {
		log.Fatal(err)
	}

	d.beacons[socket] = netcode.CreateBeacon(socket, time.Second*3, func(ping time.Duration) {
		log.Printf("Client #%d ping: %v.", socket.ID, ping)
	})

	d.onClientJoin(socket)
}

func (d *Demo) run() {
	log.Printf("Demo is running")
	for {
		select {
		case m := <-d.sockets.In:
			switch m.Message.Name {
			case "ping":
				d.handlePing(m.Socket, m.Message)
			case "greeting":
				d.handleGreeting(m.Socket, m.Message)
			case "int16":
				d.handleInt16(m.Socket, m.Message)
			default:
				log.Printf("[socket #%d] '%s': %v", m.Socket.ID, m.Message.Name, m.Message.Data)
			}
		case socket := <-d.sockets.Out:
			d.onClientLeave(socket)
		}
	}
}

func (d *Demo) broadcastTotal() {
	d.sockets.SendAll(
		&netcode.Message{"total", uint8(d.sockets.Count())},
	)
}

func (d *Demo) onClientJoin(s *netcode.Socket) {
	log.Printf("Client #%d joined.", s.ID)
	s.Send(&netcode.Message{"id", uint8(s.ID)})
	d.broadcastTotal()

	s.Send(&netcode.Message{"int16", int16(math.MaxInt16)})
}

func (d *Demo) onClientLeave(s *netcode.Socket) {
	log.Printf("Client #%d left.", s.ID)
	d.broadcastTotal()
	d.beacons[s].Destroy()
	delete(d.beacons, s)
}

func (d *Demo) handlePing(s *netcode.Socket, m *netcode.Message) {
	log.Printf("Client #%d ping: %d.", s.ID, m.Data.(uint))
	s.Send(&netcode.Message{"pong", uint(time.Now().UnixMilli())})
	s.Send(&netcode.Message{"inverse", true})
}

func (d *Demo) handleGreeting(s *netcode.Socket, m *netcode.Message) {
	log.Printf("Client #%d greets you: '%s'.", s.ID, m.Data.(string))
	s.Send(&netcode.Message{"greeting", "Hello, I'm server! 😊 Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut imperdiet molestie libero, ut sollicitudin tortor dignissim quis. Nulla iaculis nisi turpis, a malesuada nibh faucibus a. Nunc tellus lorem, varius sit amet tellus eu, dictum consectetur nulla."})
}

func (d *Demo) handleInt16(s *netcode.Socket, m *netcode.Message) {
	log.Printf("Client #%d sends int16: %d.", s.ID, m.Data.(int16))
}
