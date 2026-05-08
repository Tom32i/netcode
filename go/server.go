package netcode

import (
	"fmt"
	"github.com/gorilla/websocket"
	"log"
	"net/http"
)

func Start(port int, path string, onSocket func(w http.ResponseWriter, r *http.Request, c *websocket.Conn), checkOrigin func(r *http.Request) bool, errorHandler func(w http.ResponseWriter, r *http.Request, status int, reason error)) {
	upgrader := &websocket.Upgrader{
		ReadBufferSize:  1024,
		WriteBufferSize: 1024,
		Subprotocols:    []string{"websocket"},
		Error:           errorHandler,
		CheckOrigin:     checkOrigin,
	}

	http.HandleFunc(path, func(w http.ResponseWriter, r *http.Request) {
		s, err := upgrader.Upgrade(w, r, nil)

		if err == nil {
			onSocket(w, r, s)
		}
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
	http.Error(w, reason.Error(), status)
}
