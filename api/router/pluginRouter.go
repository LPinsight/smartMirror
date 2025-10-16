package api

import (
	"fmt"
	"net/http"
	"net/http/httputil"
	"net/url"

	"github.com/LPinsight/smartMirror/handler"
	"github.com/gorilla/mux"
)

// Proxy-Handler für ein Plugin
func proxyHandler(target string, prefix string) http.Handler {
	url, _ := url.Parse(target)
	proxy := httputil.NewSingleHostReverseProxy(url)

	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		// Pfad anpassen: /plugins/<name>/ -> /
		r.URL.Path = r.URL.Path[len(prefix):]
		proxy.ServeHTTP(w, r)
	})
}

// RegisterPlugins registriert alle Plugins als Proxy
func RegisterPlugins(router *mux.Router) {
	var plugins = handler.RegisterPlugins()

	for _, plugin := range plugins {
		// Plugin-Port
		port := plugin.Api.Port

		// Proxy: alles unter /plugins/<name>/api/ weiterleiten
		apiPrefix := fmt.Sprintf("/plugins/%s/api/", plugin.Name)
		target := fmt.Sprintf("http://localhost:%d", port)
		router.PathPrefix(apiPrefix).Handler(proxyHandler(target, apiPrefix))

		fmt.Printf("Proxy für Plugin %s registriert: %s -> %s\n", plugin.Name, apiPrefix, target)
	}

	// Statische UI-Dateien bereitstellen (alles andere außer /api/)
	router.PathPrefix("/plugins/").Handler(
		http.StripPrefix("/plugins/",
			http.FileServer(http.Dir("./plugins"))))

	// Endpoint: liefert alle Plugins inkl. config + UI
	router.HandleFunc("/plugins", handler.GetAllPlugins).Methods("GET")
}
