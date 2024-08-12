package netcode

import (
	"fmt"
	"github.com/gorilla/websocket"
	"log"
	"net/http"
)

func Start(port int, path string, onSocket func(*websocket.Conn, *http.Request)) {
	upgrader := &websocket.Upgrader{
		ReadBufferSize:  1024,
		WriteBufferSize: 1024,
		Subprotocols:    []string{"websocket"},
		Error:           ErrorHandler,
		CheckOrigin:     CheckOrigin,
	}

	http.HandleFunc(path, func(w http.ResponseWriter, r *http.Request) {
		s, err := upgrader.Upgrade(w, r, nil)

		if err != nil {
			log.Printf("Could not upgrade connection: %s", err)
			return
		}

		onSocket(s, r)
	})

	err := http.ListenAndServe(fmt.Sprintf(":%d", port), nil)

	if err != nil {
		log.Fatal(err)
	}
}

func CheckOrigin(r *http.Request) bool {
	return true
}

func ErrorHandler(w http.ResponseWriter, r *http.Request, status int, reason error) {
	log.Printf("Error: %v %v", status, reason)
}
