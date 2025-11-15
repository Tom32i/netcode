package netcode

import (
	"strconv"
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

	socket.Conn.SetPongHandler(b.onPong)

	defer b.start()

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

func (b *Beacon) start() {
	if !b.running {
		go b.run()
		b.sendPing()
	}
}

func (b *Beacon) stop() {
	if b.running {
		b.done <- true
	}
}

func (b *Beacon) destroy() {
	b.stop()
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
	b.socket.Ping(strconv.FormatInt(time.Now().UnixMicro(), 10))
}

func (b *Beacon) onPong(response string) error {
	now := time.Now()
	value, _ := strconv.ParseInt(response, 10, 64)
	ping := time.UnixMicro(value)

	defer b.callback(now.Sub(ping))

	return nil
}
