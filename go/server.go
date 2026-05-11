package netcode

import (
	"fmt"
	"github.com/coder/websocket"
	"log"
	"net/http"
)

type Conn = websocket.Conn
type AcceptOptions = websocket.AcceptOptions

func Start(port int, path string, onSocket func(w http.ResponseWriter, r *http.Request, c *Conn), o *AcceptOptions) {
	http.HandleFunc(path, func(w http.ResponseWriter, r *http.Request) {
		s, err := websocket.Accept(w, r, o)

		if err == nil {
			onSocket(w, r, s)
		} else {
			log.Printf("Error: %s", err)
		}
	})

	err := http.ListenAndServe(fmt.Sprintf(":%d", port), nil)

	if err != nil {
		log.Fatal(err)
	}
}
