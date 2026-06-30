package netcode

import (
	"context"
	"sync/atomic"
	"time"
)

func CreateBeacon(socket *Socket, interval time.Duration, callback func(time.Duration)) *Beacon {
	b := Beacon{
		socket:   socket,
		callback: callback,
		interval: interval,
		timeout:  interval,
		ticker:   time.NewTicker(interval),
		done:     make(chan bool, 1),
	}

	b.ticker.Stop()

	defer b.Start()

	return &b
}

type Beacon struct {
	socket   *Socket
	callback func(time.Duration)
	interval time.Duration
	timeout  time.Duration
	ticker   *time.Ticker
	done     chan bool
	running  atomic.Bool
}

func (b *Beacon) Start() {
	if !b.running.CompareAndSwap(false, true) {
		return
	}

	go b.run()
	b.sendPing()
}

func (b *Beacon) Stop() {
	if !b.running.CompareAndSwap(true, false) {
		return
	}

	// done is buffered, so this never blocks even while run() is mid-ping.
	b.done <- true
}

func (b *Beacon) Destroy() {
	b.Stop()
}

func (b *Beacon) run() {
	defer b.ticker.Stop()
	defer b.running.Store(false)

	b.ticker.Reset(b.interval)

	for {
		select {
		case <-b.done:
			return
		case <-b.ticker.C:
			if !b.sendPing() {
				return
			}
		}
	}
}

// sendPing pings the client and waits up to timeout for the pong.
// On failure the peer is unresponsive, so close now (no handshake).
func (b *Beacon) sendPing() bool {
	ctx, cancel := context.WithTimeout(context.Background(), b.timeout)
	defer cancel()

	start := time.Now()

	if err := b.socket.PingContext(ctx); err != nil {
		b.socket.CloseNow()
		return false
	}

	b.callback(time.Since(start))

	return true
}
