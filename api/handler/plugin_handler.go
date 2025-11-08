package handler

import (
	"encoding/json"
	"net/http"
	"os"
	"path/filepath"

	iface "github.com/LPinsight/smartMirror/interface"
)

func GetAllPlugins(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(pluginService.GetAll())
}

func RegisterPlugins() {
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
		mainPath := filepath.Join(pluginDir, name, "plugin.json")
		configPath := filepath.Join(pluginDir, name, "config.json")

		var main iface.PluginInfo
		var config []iface.ConfigOption

		if data, err := os.ReadFile(mainPath); err == nil {
			json.Unmarshal(data, &main)
		}

		if data, err := os.ReadFile(configPath); err == nil {
			json.Unmarshal(data, &config)
		}

		uiUrl := "http://localhost:8080/plugins/" + name + "/ui/"

		pluginService.Create(iface.Plugin{
			Name:         main.Name,
			Author:       main.Author,
			Beschreibung: main.Beschreibung,
			Version:      main.Version,
			Repository:   main.Repository,
			Config:       config,
			UiUrl:        uiUrl,
		})
	}
}
