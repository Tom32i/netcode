package server

import (
	"errors"
)

type ClientDirectory struct {
	clients map[uint]*Client
	max     uint
}

func (d *ClientDirectory) generateId() (uint, error) {
	for id := uint(0); id < d.max; id++ {
		_, ok := d.clients[id]

		if !ok {
			return id, nil
		}
	}

	return uint(0), errors.New("Client limit reached!")
}

func (d *ClientDirectory) Add(c *Client) error {
	id, err := d.generateId()

	if err != nil {
		return err
	}

	c.ID = id

	d.clients[c.ID] = c

	return nil
}

func (d *ClientDirectory) Remove(c *Client) {
	delete(d.clients, c.ID)
}

func (d *ClientDirectory) Count() int {
	return len(d.clients)
}

func (d *ClientDirectory) ForEach(callback func(*Client)) {
	for _, c := range d.clients {
		callback(c)
	}
}

func (d *ClientDirectory) ForOther(client *Client, callback func(*Client)) {
	for _, c := range d.clients {
		if c.ID != client.ID {
			callback(c)
		}
	}
}

func CreateClientDirectory(max uint) *ClientDirectory {
	return &ClientDirectory{make(map[uint]*Client), max}
}
