package main

import (
	"fmt"
	"log"
	"net/http"

	"github.com/LPinsight/smartMirror/handler"
	api "github.com/LPinsight/smartMirror/router"
	"github.com/LPinsight/smartMirror/service"
	"github.com/LPinsight/smartMirror/websocket"
)

func main() {
	// Datenbank-Service erstellen und vorhandene ENV-Konfiguration prüfen.
	databaseService := service.NewDatabaseService("./.env")
	databaseService.LoadFromEnv()

	// Services ohne Datenbank initialisieren.
	pluginService := service.NewPluginService()
	handler.Init(nil, nil, pluginService)
	handler.InitDatabase(databaseService)

	// DB-abhängige Services nur bei erfolgreicher Verbindung erstellen.
	database := databaseService.Database()
	if database != nil {
		widgetService := service.NewWidgetService(database, pluginService)
		displayService := service.NewDisplayService(database, widgetService)
		handler.Init(displayService, widgetService, pluginService)
	}

	wsService := websocket.NewWebSocketService()
	wsService.Run()

	router := api.NewRouter(wsService, pluginService)

	fmt.Println("Server started at http://0.0.0.0:8080")
	// log.Fatal(endless.ListenAndServe("0.0.0.0:8080", router))
	log.Fatal(http.ListenAndServe(":8080", router))
}
