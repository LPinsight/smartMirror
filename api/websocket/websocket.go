package websocket

import (
	"net/http"

	"github.com/gorilla/websocket"
)

type WebSocketService struct {
	clients   map[*websocket.Conn]bool
	broadcast chan string
	upgrader  websocket.Upgrader
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
			for client := range ws.clients {
				err := client.WriteMessage(websocket.TextMessage, []byte(msg))
				if err != nil {
					client.Close()
					delete(ws.clients, client)
				}
			}
		}
	}()
}

func (ws *WebSocketService) Handler(w http.ResponseWriter, r *http.Request) {
	conn, err := ws.upgrader.Upgrade(w, r, nil)
	if err != nil {
		return
	}

	defer conn.Close()

	ws.clients[conn] = true

	for {
		_, msg, err := conn.ReadMessage()
		if err != nil {
			delete(ws.clients, conn)
			break
		}

		ws.broadcast <- string(msg)
	}
}

func (ws *WebSocketService) BroadcastMessage(msg string) {
	ws.broadcast <- msg
}
