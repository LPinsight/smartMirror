package websocket

import (
	"net/http"
	"sync"

	"github.com/gorilla/websocket"
)

type WebSocketService struct {
	clients   map[*websocket.Conn]bool
	broadcast chan string
	upgrader  websocket.Upgrader
	mutex     sync.RWMutex
}

func NewWebSocketService() *WebSocketService {
	return &WebSocketService{
		clients:   make(map[*websocket.Conn]bool),
		broadcast: make(chan string),
		upgrader: websocket.Upgrader{
			CheckOrigin: func(r *http.Request) bool { return true },
		},
	}
}

func (ws *WebSocketService) Run() {
	go func() {
		for {
			msg := <-ws.broadcast

			ws.mutex.RLock()
			for client := range ws.clients {
				err := client.WriteMessage(websocket.TextMessage, []byte(msg))
				if err != nil {
					client.Close()

					ws.mutex.RUnlock()
					ws.mutex.Lock()
					delete(ws.clients, client)
					ws.mutex.Unlock()
					ws.mutex.RLock()
				}
			}
			ws.mutex.RUnlock()
		}
	}()
}

func (ws *WebSocketService) Handler(w http.ResponseWriter, r *http.Request) {
	conn, err := ws.upgrader.Upgrade(w, r, nil)
	if err != nil {
		return
	}

	defer conn.Close()

	ws.mutex.Lock()
	ws.clients[conn] = true
	ws.mutex.Unlock()

	for {
		_, msg, err := conn.ReadMessage()
		if err != nil {
			ws.mutex.Lock()
			delete(ws.clients, conn)
			ws.mutex.Unlock()
			break
		}

		ws.broadcast <- string(msg)
	}
}

func (ws *WebSocketService) BroadcastMessage(msg string) {
	ws.broadcast <- msg
}
