package handler

import (
	"net/http"

	"github.com/LPinsight/smartMirror/service"
)

var displayService *service.DisplayService
var widgetService *service.WidgetService
var pluginService *service.PluginService

func Init(ds *service.DisplayService, ws *service.WidgetService, ps *service.PluginService) {
	displayService = ds
	widgetService = ws
	pluginService = ps
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
