package api

import (
	"net/http"
	"path/filepath"

	"github.com/LPinsight/smartMirror/handler"
	"github.com/LPinsight/smartMirror/service"
	"github.com/gorilla/mux"
)

// RegisterPlugins registriert alle Plugins als Proxy
func RegisterPlugins(router *mux.Router, pluginService *service.PluginService) {
	//TODO: Verzeichnis Route anpassen
	// uiPath := filepath.Join("./../../smartMirror-plugins")
	uiPath := filepath.Join("/app/plugins")

	handler.RegisterPlugins()

	router.PathPrefix("/{name}/ui").Handler(enableCORS(http.HandlerFunc(
		func(w http.ResponseWriter, r *http.Request) {
			name := mux.Vars(r)["name"]

			if _, err := pluginService.GetByName(name); err != nil {
				http.NotFound(w, r)
				return
			}

			pluginUIPath := filepath.Join(uiPath, name, "ui")
			routerPrefix := "/plugins/" + name + "/ui/"

			fileServer := http.FileServer(http.Dir(pluginUIPath))
			http.StripPrefix(routerPrefix, fileServer).ServeHTTP(w, r)
		},
	)))

	// Endpoint: liefert alle Plugins inkl. config + UI
	router.HandleFunc("", handler.GetAllPlugins).Methods("GET", "OPTIONS")
	router.HandleFunc("/reload", handler.ReloadPlugins).Methods("POST", "OPTIONS")
	router.HandleFunc("/install", handler.InstallPlugin).Methods("POST", "OPTIONS")
	router.HandleFunc("/remove", handler.RemovePlugin).Methods("POST", "OPTIONS")
	router.HandleFunc("/update", handler.UpdatePlugin).Methods("POST", "OPTIONS")
	router.HandleFunc("/version", handler.CheckPluginVersion).Methods("GET", "OPTIONS")
	router.HandleFunc("/{name}/config", handler.GetConfigByName).Methods("GET", "OPTIONS")
}
