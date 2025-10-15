package handler

import (
	"encoding/json"
	"fmt"
	"net/http"
	"os"
	"path/filepath"

	iface "github.com/LPinsight/smartMirror/interface"
	"github.com/LPinsight/smartMirror/service"
)

var pluginService = service.NewPluginService()

func GetAllPlugins(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(pluginService.GetAll())
}

func RegisterPlugins() map[string]*iface.Plugin {
	pluginDir := "./../api/plugins"
	dirs, err := os.ReadDir(pluginDir)
	if err != nil {
		panic(err)
	}

	for _, d := range dirs {
		if !d.IsDir() {
			continue
		}

		name := d.Name()

		// config.json
		cfgPath := filepath.Join(pluginDir, name, "config.json")
		cfgData, _ := os.ReadFile(cfgPath)
		cfg := iface.PluginConfig{}
		json.Unmarshal(cfgData, &cfg)

		// api.json
		apiPath := filepath.Join(pluginDir, name, "api.json")
		apiData, _ := os.ReadFile(apiPath)
		api := map[string]interface{}{}
		json.Unmarshal(apiData, &api)

		uiUrl := fmt.Sprintf("/plugins/%s/main.js", name)

		pluginService.Create(iface.Plugin{
			Name:   name,
			Config: cfg,
			Api:    api,
			UiUrl:  uiUrl,
		})
	}

	return pluginService.GetAll()
}
