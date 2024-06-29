package netcode

import (
    "errors"
)

type ClientDirectory struct {
    List map[uint]*Client
    max     uint
}

func (d *ClientDirectory) generateId() (uint, error) {
    for id := uint(0); id < d.max; id++ {
        _, ok := d.List[id]

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

    d.List[c.ID] = c

    return nil
}

func (d *ClientDirectory) Remove(c *Client) {
    delete(d.List, c.ID)
}

func (d *ClientDirectory) Count() int {
    return len(d.List)
}

func (d *ClientDirectory) ForEach(callback func(*Client)) {
    for _, c := range d.List {
        callback(c)
    }
}

func (d *ClientDirectory) ForOther(client *Client, callback func(*Client)) {
    for _, c := range d.List {
        if c.ID != client.ID {
            callback(c)
        }
    }
}


func CreateClientDirectory(max uint) *ClientDirectory {
	return &ClientDirectory{make(map[uint]*Client), max}
}
