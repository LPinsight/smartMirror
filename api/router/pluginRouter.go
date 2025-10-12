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
		port := int(plugin.Api["port"].(float64))

		// Proxy: alles unter /plugins/<name>/ weiterleiten
		prefix := "/plugins/" + plugin.Name
		target := fmt.Sprintf("http://localhost:%d", port)
		router.PathPrefix(prefix).Handler(proxyHandler(target, prefix))

		fmt.Printf("Proxy für Plugin %s registriert: %s -> %s\n", plugin.Name, prefix, target)
	}

	// Endpoint: liefert alle Plugins inkl. config + UI
	router.HandleFunc("/plugins", handler.GetAllPlugins).Methods("GET")
}
