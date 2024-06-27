package server

import (
	"github.com/Tom32i/netcode/internal/codec"
	//"github.com/Tom32i/netcode/internal/security"
	//"github.com/google/uuid"
	"github.com/gorilla/websocket"
	"log"
)

type Client struct {
	ID uint
	//uuid    uuid.UUID
	IP string
	//token   security.Token
	in      chan ClientMessage
	socket  *websocket.Conn
	encoder *codec.BinaryEncoder
}

type ClientMessage struct {
	Client  *Client
	Message codec.Message
}

func (c *Client) Send(message codec.Message) {
	c.Write(c.encoder.Encode(message))
}

func (c *Client) Write(data []byte) {
	c.socket.WriteMessage(websocket.BinaryMessage, data)
}

func (c *Client) run(onClose func(*Client)) {
	defer func() {
		c.socket.Close()
		onClose(c)
	}()

	for {
		_, data, err := c.socket.ReadMessage()

		if err != nil {
			if websocket.IsUnexpectedCloseError(err, websocket.CloseGoingAway, websocket.CloseAbnormalClosure) {
				log.Printf("error: %v", err)
			}
			break
		}

		c.in <- ClientMessage{c, c.encoder.Decode(data)}
	}
}
