package netcode

import (
	"context"
	"net/http"
	"net/http/httptest"
	"strings"
	"testing"
	"time"

	"github.com/coder/websocket"
)

func testEncoder() *BinaryEncoder {
	return CreateBinaryEncoder([]*RegisteredCodec{}, UInt8Codec{})
}

func wsURL(s *httptest.Server) string {
	return "ws" + strings.TrimPrefix(s.URL, "http")
}

// TestReadTimeoutEvictsSilentSocket verifies that a connection which sends no
// data within the read deadline is closed, firing Sockets.Out. The client keeps
// reading (so it auto-answers protocol pings); only the data read-deadline can
// trigger the closure here.
func TestReadTimeoutEvictsSilentSocket(t *testing.T) {
	sockets := CreateSockets(testEncoder(), 256, 1)
	sockets.SetReadTimeout(150 * time.Millisecond)

	handlerDone := make(chan struct{})
	server := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		c, err := websocket.Accept(w, r, nil)
		if err != nil {
			t.Errorf("accept: %v", err)
			return
		}
		if _, err := sockets.Add(c); err != nil {
			t.Errorf("add: %v", err)
			return
		}
		<-handlerDone
	}))
	defer server.Close()
	defer close(handlerDone)

	ctx, cancel := context.WithTimeout(context.Background(), 2*time.Second)
	defer cancel()

	client, _, err := websocket.Dial(ctx, wsURL(server), nil)
	if err != nil {
		t.Fatalf("dial: %v", err)
	}
	defer client.CloseNow()

	// Keep reading so the client auto-responds to pings but never sends data.
	go func() { client.Read(ctx) }()

	select {
	case <-sockets.Out:
		// Evicted as expected.
	case <-time.After(time.Second):
		t.Fatal("silent socket was not evicted by the read deadline")
	}
}

// TestBeaconEvictsUnresponsiveSocket verifies that the beacon closes a
// connection that stops answering pings. The client never reads, so it never
// auto-pongs; the bounded ping must time out and close the socket.
func TestBeaconEvictsUnresponsiveSocket(t *testing.T) {
	sockets := CreateSockets(testEncoder(), 256, 1)

	handlerDone := make(chan struct{})
	server := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		c, err := websocket.Accept(w, r, nil)
		if err != nil {
			t.Errorf("accept: %v", err)
			return
		}
		socket, err := sockets.Add(c)
		if err != nil {
			t.Errorf("add: %v", err)
			return
		}
		CreateBeacon(socket, 100*time.Millisecond, func(time.Duration) {})
		<-handlerDone
	}))
	defer server.Close()
	defer close(handlerDone)

	ctx, cancel := context.WithTimeout(context.Background(), 2*time.Second)
	defer cancel()

	client, _, err := websocket.Dial(ctx, wsURL(server), nil)
	if err != nil {
		t.Fatalf("dial: %v", err)
	}
	defer client.CloseNow()

	// Never read: the client will not auto-answer pings, so the beacon's ping
	// times out and the socket is force-closed.
	select {
	case <-sockets.Out:
		// Evicted as expected.
	case <-time.After(time.Second):
		t.Fatal("unresponsive socket was not evicted by the beacon")
	}
}

// TestBeaconStartStop verifies the running flag is honoured so Stop actually
// halts the beacon and a subsequent Start can restart it without leaking.
func TestBeaconStartStop(t *testing.T) {
	b := &Beacon{
		interval: time.Hour,
		timeout:  time.Hour,
		ticker:   time.NewTicker(time.Hour),
		done:     make(chan bool, 1),
	}
	b.ticker.Stop()

	b.running.Store(true)
	go b.run()

	b.Stop()

	if b.running.Load() {
		t.Fatal("beacon still marked running after Stop")
	}

	// A second Stop must be a no-op (not block, not panic).
	b.Stop()
}
