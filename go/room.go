package netcode

import (
    "github.com/gorilla/websocket"
    "net/http"
)

type Event struct {
    Name string
    Data any
}

type Room struct {
    Clients *ClientDirectory
    Encoder *BinaryEncoder
    In      chan ClientMessage
    Out     chan Event
}

func (r *Room) Join(socket *websocket.Conn) error {
    client := &Client{
        socket:  socket,
        In:      r.In,
        encoder: r.Encoder,
    }

    err := r.Clients.Add(client)

    if err != nil {
        return err
    }

    go client.Run(r.Remove)

    r.Out <- Event{"client:join", client}

    return nil
}

func (r *Room) Remove(client *Client) {
    r.Clients.Remove(client)
    r.Out <- Event{"client:leave", client}
    //r.writeAll(Message{"client:remove", c.id})
}

func (r *Room) Write(client *Client, message *Message) {
    client.Send(message)
}

func (r *Room) WriteAll(message *Message) {
    bytes := r.Encoder.Encode(message)
    r.Clients.ForEach(func (c *Client) { c.Write(bytes) })
    /*for _, c := range r.Clients {
        c.write(bytes)
    }*/
}

func (r *Room) WriteOther(client *Client, message *Message) {
    bytes := r.Encoder.Encode(message)
    r.Clients.ForOther(client, func (c *Client) { c.Write(bytes) })
    /*for _, c := range r.Clients {
        if c.id != client.id {
            c.write(bytes)
        }
    }*/
}

func CreateRoom(clients *ClientDirectory, encoder *BinaryEncoder) *Room {
    return &Room{
        Clients: clients,
        Encoder: encoder,
        In:      make(chan ClientMessage),
        Out:     make(chan Event),
    }
}

func getIP(r *http.Request) string {
    if r.Header.Get("x-real-ip") != "" {
        return r.Header.Get("x-real-ip")
    }

    if r.Header.Get("X-Forwarded-For") != "" {
        return r.Header.Get("X-Forwarded-For")
    }

    return "unknown"
}
