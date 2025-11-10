package api

import (
	"log"
	"net/http"
	"path/filepath"

	"github.com/LPinsight/smartMirror/handler"
	"github.com/LPinsight/smartMirror/service"
	"github.com/gorilla/mux"
)

// RegisterPlugins registriert alle Plugins als Proxy
func RegisterPlugins(router *mux.Router, pluginService *service.PluginService) {
	uiPath := filepath.Join("./../plugins")

	handler.RegisterPlugins()

	// Statischer File-Server für jede Plugin-UI
	for name := range pluginService.GetAll() {
		route := "/plugins/" + name + "/ui"
		path := filepath.Join(uiPath, name, "ui")

		log.Println("UI-Route:", route, "->", path)

		fs := http.StripPrefix(route, http.FileServer(http.Dir(path)))

		router.PathPrefix("/" + name + "/ui").Handler(enableCORS(fs))
	}

	// Endpoint: liefert alle Plugins inkl. config + UI
	router.HandleFunc("", handler.GetAllPlugins).Methods("GET", "OPTIONS")
	router.HandleFunc("/install", handler.InstallPlugin).Methods("POST", "OPTIONS")
	router.HandleFunc("/remove", handler.RemovePlugin).Methods("POST", "OPTIONS")
	router.HandleFunc("/update", handler.UpdatePlugin).Methods("POST", "OPTIONS")
	router.HandleFunc("/version", handler.CheckPluginVersion).Methods("GET", "OPTIONS")
	router.HandleFunc("/{name}/config", handler.GetConfigByName).Methods("GET", "OPTIONS")
}
