package api

import (
	"encoding/json"
	"fmt"
	"net/http"
	"net/http/httputil"
	"net/url"
	"os"
	"path/filepath"

	"github.com/gorilla/mux"
)

type Plugin struct {
	Name   string                 `json:"name"`
	Config map[string]interface{} `json:"config"`
	Api    map[string]interface{} `json:"api"`
	UiUrl  string                 `json:"uiUrl"`
}

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
	pluginDir := "./../api/plugins"
	dirs, err := os.ReadDir(pluginDir)
	if err != nil {
		panic(err)
	}

	plugins := []Plugin{}

	for _, d := range dirs {
		if !d.IsDir() {
			continue
		}

		name := d.Name()

		// config.json
		cfgPath := filepath.Join(pluginDir, name, "config.json")
		cfgData, _ := os.ReadFile(cfgPath)
		cfg := map[string]interface{}{}
		json.Unmarshal(cfgData, &cfg)

		// api.json
		apiPath := filepath.Join(pluginDir, name, "api.json")
		apiData, _ := os.ReadFile(apiPath)
		api := map[string]interface{}{}
		json.Unmarshal(apiData, &api)

		// Plugin-Port
		port := int(api["port"].(float64))

		// Proxy: alles unter /plugins/<name>/ weiterleiten
		prefix := "/plugins/" + name
		target := fmt.Sprintf("http://localhost:%d", port)
		router.PathPrefix(prefix).Handler(proxyHandler(target, prefix))

		fmt.Printf("Proxy für Plugin %s registriert: %s -> %s\n", name, prefix, target)

		uiUrl := fmt.Sprintf("/plugins/%s/main.js", name)

		plugins = append(plugins, Plugin{
			Name:   name,
			Config: cfg,
			Api:    api,
			UiUrl:  uiUrl,
		})
	}

	// Endpoint: liefert alle Plugins inkl. config + UI
	router.HandleFunc("/plugins", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(plugins)
	}).Methods("GET")
}
