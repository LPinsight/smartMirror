package handler

import "github.com/LPinsight/smartMirror/service"

var displayService *service.DisplayService
var widgetService *service.WidgetService
var pluginService *service.PluginService

func Init(ds *service.DisplayService, ws *service.WidgetService, ps *service.PluginService) {
	displayService = ds
	widgetService = ws
	pluginService = ps
}
