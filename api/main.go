package main

import (
	"fmt"
	"log"
	"net/http"

	"github.com/LPinsight/smartMirror/db"
	"github.com/LPinsight/smartMirror/handler"
	api "github.com/LPinsight/smartMirror/router"
	"github.com/LPinsight/smartMirror/service"
)

func main() {
	db.Init()

	// Services erzeugen
	pluginService := service.NewPluginService()
	widgetService := service.NewWidgetService(db.DB, pluginService)
	displayService := service.NewDisplayService(db.DB, widgetService)

	handler.Init(displayService, widgetService, pluginService)

	router := api.NewRouter()

	fmt.Println("Server started at http://localhost:8080")
	log.Fatal(http.ListenAndServe(":8080", router))
}
