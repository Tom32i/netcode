package netcode

import (
	//"github.com/google/uuid"
	"github.com/gorilla/websocket"
	"log"
)

type Client struct {
	ID uint
	//uuid    uuid.UUID
	// IP strings
	//token   security.Token
	In      chan ClientMessage
	socket  *websocket.Conn
	encoder *BinaryEncoder
}

type ClientMessage struct {
	Client  *Client
	Message *Message
}

func (c *Client) Send(message *Message) {
	c.Write(c.encoder.Encode(message))
}

func (c *Client) Write(data []byte) {
	c.socket.WriteMessage(websocket.BinaryMessage, data)
}

func (c *Client) Run(onClose func(*Client)) {
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

		c.In <- ClientMessage{c, c.encoder.Decode(data)}
	}
}
