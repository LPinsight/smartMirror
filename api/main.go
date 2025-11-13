package main

import (
	"fmt"
	"log"

	"github.com/fvbock/endless"

	"github.com/LPinsight/smartMirror/db"
	"github.com/LPinsight/smartMirror/handler"
	api "github.com/LPinsight/smartMirror/router"
	"github.com/LPinsight/smartMirror/service"
	"github.com/LPinsight/smartMirror/websocket"
)

func main() {
	db.Init()

	// Services erzeugen
	pluginService := service.NewPluginService()
	widgetService := service.NewWidgetService(db.DB, pluginService)
	displayService := service.NewDisplayService(db.DB, widgetService)

	handler.Init(displayService, widgetService, pluginService)

	wsService := websocket.NewWebSocketService()
	wsService.Run()

	router := api.NewRouter(wsService, pluginService)

	fmt.Println("Server started at http://0.0.0.0:8080")
	log.Fatal(endless.ListenAndServe("0.0.0.0:8080", router))
	// log.Fatal(http.ListenAndServe(":8080", router))
}
