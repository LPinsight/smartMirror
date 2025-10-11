package main

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"os"
)

type Endpoint struct {
	Path    string   `json:"path"`
	Methods []string `json:"methods"`
	Handler string   `json:"handler"`
}

type PluginConfig struct {
	Port      int        `json:"port"`
	Endpoints []Endpoint `json:"endpoints"`
}

func main() {
	// api.json lesen
	file, err := os.ReadFile("api.json")
	if err != nil {
		log.Fatal(err)
	}

	var cfg PluginConfig
	if err := json.Unmarshal(file, &cfg); err != nil {
		log.Fatal(err)
	}

	// HandlerMap aus handlers.go verwenden
	for _, ep := range cfg.Endpoints {
		ep := ep
		handlerFunc, ok := HandlerMap[ep.Handler]
		if !ok {
			log.Printf("Handler %s nicht gefunden für %s\n", ep.Handler, ep.Path)
			continue
		}

		http.HandleFunc(ep.Path, func(w http.ResponseWriter, r *http.Request) {
			// Methoden prüfen
			allowed := false
			for _, m := range ep.Methods {
				if r.Method == m {
					allowed = true
					break
				}
			}
			if !allowed {
				http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
				return
			}

			handlerFunc(w, r)
		})

		fmt.Printf("Endpoint registriert: %s Methods: %v -> Handler: %s\n", ep.Path, ep.Methods, ep.Handler)
	}

	addr := fmt.Sprintf(":%d", cfg.Port)
	log.Printf("Plugin läuft auf %s\n", addr)
	log.Fatal(http.ListenAndServe(addr, nil))
}
