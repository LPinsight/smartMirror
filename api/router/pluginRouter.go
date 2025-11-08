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

	for name := range pluginService.GetAll() {
		route := "/plugins/" + name + "/ui/"
		path := filepath.Join(uiPath, name, "ui")
		log.Println("UI-Route:", route, "->", path)
		// fs := http.StripPrefix(route, http.FileServer(http.Dir(path)))
		fs := http.FileServer(http.Dir(path))

		handler := func(w http.ResponseWriter, r *http.Request) {
			// CORS Header
			w.Header().Set("Access-Control-Allow-Origin", "http://localhost:4200")
			w.Header().Set("Access-Control-Allow-Methods", "GET, OPTIONS")
			w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")
			w.Header().Set("Content-Type", "application/javascript")

			// Preflight
			if r.Method == http.MethodOptions {
				w.WriteHeader(http.StatusOK)
				return
			}

			// Manuell StripPrefix
			r2 := r.Clone(r.Context())
			r2.URL.Path = r.URL.Path[len(route):]

			fs.ServeHTTP(w, r2)
		}

		router.Handle(route+"{file:.*}", http.HandlerFunc(handler))
	}

	// Endpoint: liefert alle Plugins inkl. config + UI
	router.HandleFunc("/plugins", handler.GetAllPlugins).Methods("GET")
}
