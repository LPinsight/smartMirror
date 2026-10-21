package handler

import (
	"net/http"

	"github.com/LPinsight/smartMirror/service"
)

var displayService *service.DisplayService
var widgetService *service.WidgetService
var pluginService *service.PluginService
var databaseService *service.DatabaseService

func Init(ds *service.DisplayService, ws *service.WidgetService, ps *service.PluginService) {
	displayService = ds
	widgetService = ws
	pluginService = ps
}

func InitDatabase(ds *service.DatabaseService) {
	databaseService = ds
}

func GetVersion(w http.ResponseWriter, r *http.Request) {

	writeJSON(w, map[string]string{
		"version": service.GetAppVersion(),
	}, http.StatusOK)
}

func HealthCheckHandler(w http.ResponseWriter, r *http.Request) {
	w.WriteHeader(http.StatusOK)
	w.Write([]byte(`{"status":"ok"}`))
}
