package netcode

import (
	"sync"
	"time"
)

func CreateBeacon(socket *Socket, interval time.Duration, callback func(time.Duration)) *Beacon {
	b := Beacon{
		socket:   socket,
		callback: callback,
		interval: interval,
		ticker:   time.NewTicker(interval),
		done:     make(chan bool),
	}

	b.ticker.Stop()

	defer b.Start()

	return &b
}

type Beacon struct {
	socket   *Socket
	callback func(time.Duration)
	interval time.Duration
	ticker   *time.Ticker
	done     chan bool
	ping     time.Time
	mu       sync.RWMutex
	running  bool
}

func (b *Beacon) Start() {
	if !b.running {
		go b.run()
		b.sendPing()
	}
}

func (b *Beacon) Stop() {
	if b.running {
		b.done <- true
	}
}

func (b *Beacon) Destroy() {
	b.Stop()
	close(b.done)
}

func (b *Beacon) run() {
	defer b.ticker.Stop()

	b.ticker.Reset(b.interval)

	for {
		select {
		case <-b.done:
			return
		case <-b.ticker.C:
			b.sendPing()
		}
	}
}

func (b *Beacon) sendPing() {
	ping := time.Now()
	err := b.socket.Ping()
	pong := time.Now()

	if err == nil {
		b.callback(pong.Sub(ping))
	}
}
