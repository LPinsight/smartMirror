package handler

import (
	"encoding/json"
	"fmt"
	"net/http"
	"os"
	"path/filepath"

	iface "github.com/LPinsight/smartMirror/interface"
)

func GetAllPlugins(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(pluginService.GetAll())
}

func RegisterPlugins() map[string]*iface.Plugin {
	pluginDir := "./../plugins"
	dirs, err := os.ReadDir(pluginDir)
	if err != nil {
		panic(err)
	}

	for _, d := range dirs {
		if !d.IsDir() {
			continue
		}

		name := d.Name()

		// plugin.json
		mainPath := filepath.Join(pluginDir, name, "plugin.json")
		mainData, _ := os.ReadFile(mainPath)
		main := iface.PluginJSON{}
		json.Unmarshal(mainData, &main)

		// config.json
		cfgPath := filepath.Join(pluginDir, name, "config.json")
		cfgData, _ := os.ReadFile(cfgPath)
		cfg := []iface.ConfigOption{}
		json.Unmarshal(cfgData, &cfg)

		// api.json
		apiPath := filepath.Join(pluginDir, name, "api.json")
		apiData, _ := os.ReadFile(apiPath)
		api := iface.PluginAPI{}
		json.Unmarshal(apiData, &api)

		uiUrl := fmt.Sprintf("http://localhost:%d/ui", api.Port)
		// uiUrl := fmt.Sprintf("plugins/%s/ui/main.js", name)

		pluginService.Create(iface.Plugin{
			Name:         main.Name,
			Author:       main.Author,
			Beschreibung: main.Beschreibung,
			Version:      main.Version,
			Config:       cfg,
			Api:          api,
			UiUrl:        uiUrl,
		})
	}

	return pluginService.GetAll()
}
