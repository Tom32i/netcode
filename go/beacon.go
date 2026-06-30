package netcode

import (
	"context"
	"sync"
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
	mu       sync.RWMutex
	running  bool
}

func (b *Beacon) Start() {
	b.mu.Lock()
	if b.running {
		b.mu.Unlock()
		return
	}
	b.running = true
	b.mu.Unlock()

	go b.run()
	b.sendPing()
}

func (b *Beacon) Stop() {
	b.mu.Lock()
	if !b.running {
		b.mu.Unlock()
		return
	}
	b.running = false
	b.mu.Unlock()

	// done is buffered (cap 1) so this never blocks, even while run() is parked
	// inside a ping waiting for the timeout.
	b.done <- true
}

func (b *Beacon) Destroy() {
	b.Stop()
}

func (b *Beacon) run() {
	defer b.ticker.Stop()
	defer func() {
		// Clear running on any exit (including the ping-failure path below) so a
		// later Start can restart the beacon.
		b.mu.Lock()
		b.running = false
		b.mu.Unlock()
	}()

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

// sendPing pings the client and waits up to timeout for the pong. A successful
// pong reports the round-trip latency. A failure (timeout or dead connection)
// closes the socket so the read loop unblocks and the disconnect is detected,
// and returns false to stop the beacon. This is what evicts silently-dropped
// connections (closed laptop, lost wifi) that never send a close frame.
func (b *Beacon) sendPing() bool {
	ctx, cancel := context.WithTimeout(context.Background(), b.timeout)
	defer cancel()

	start := time.Now()
	err := b.socket.PingContext(ctx)

	if err != nil {
		// The peer is unresponsive: close immediately rather than attempting a
		// handshake it will never answer, so the read loop unblocks at once.
		b.socket.CloseNow()
		return false
	}

	b.callback(time.Since(start))

	return true
}
