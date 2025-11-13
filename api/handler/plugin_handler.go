package handler

import (
	"encoding/json"
	"fmt"
	"net/http"
	"os"
	"path/filepath"
	"strings"
	"time"

	iface "github.com/LPinsight/smartMirror/interface"
	"github.com/LPinsight/smartMirror/service"
	"github.com/gorilla/mux"
)

func GetAllPlugins(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(pluginService.GetAll())
}

func CheckPluginVersion(w http.ResponseWriter, r *http.Request) {
	plugins := pluginService.GetAll()

	for i, plugin := range plugins {
		latestVersion := getLatestPluginVersion(plugin.Repository)
		plugins[i].Latest = latestVersion
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(plugins)
}

func GetConfigByName(w http.ResponseWriter, r *http.Request) {
	name := mux.Vars(r)["name"]
	config, _ := pluginService.GetConfig(name)

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(config)
}

func RegisterPlugins() {
	pluginDir := "./../plugins"

	// Prüfen, ob das Verzeichnis existiert
	if _, err := os.Stat(pluginDir); os.IsNotExist(err) {
		fmt.Println("⚠ Plugins-Verzeichnis existiert nicht oder ist leer, überspringe Registrierung")
		return
	}

	dirs, err := os.ReadDir(pluginDir)
	if err != nil {
		panic(err)
	}

	// Registriere das Core-Plugin
	pluginService.Create(iface.Plugin{
		Name:         "SmartMirror Core",
		Author:       "slibbo",
		Beschreibung: "Hauptsystem des SmartMirror",
		Version:      service.GetAppVersion(),
		Latest:       getLatestPluginVersion("https://github.com/LPinsight/smartMirror"),
		Repository:   "https://github.com/LPinsight/smartMirror",
		Config:       []iface.ConfigOption{},
		UiUrl:        "",
	})

	// Durchlaufe alle Plugin-Verzeichnisse
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

		latestVersion := getLatestPluginVersion(main.Repository)

		pluginService.Create(iface.Plugin{
			Name:         main.Name,
			Author:       main.Author,
			Beschreibung: main.Beschreibung,
			Version:      main.Version,
			Latest:       latestVersion,
			Repository:   main.Repository,
			Config:       config,
			UiUrl:        uiUrl,
		})
	}
}

func getLatestPluginVersion(name string) string {
	apiUrl := fmt.Sprintf("https://api.github.com/repos/%s/releases/latest", normalizeRepoURL(name))

	client := &http.Client{
		Timeout: 5 * time.Second, // 5 Sekunden
	}

	req, err := http.NewRequest("GET", apiUrl, nil)
	if err != nil {
		return ""
	}

	req.Header.Set("Accept", "application/vnd.github+json")
	req.Header.Set("User-Agent", "smartMirror-App")

	resp, err := client.Do(req)
	if err != nil {
		return ""
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		return ""
	}

	var release iface.GithubRelease
	if err := json.NewDecoder(resp.Body).Decode(&release); err != nil {
		return ""
	}

	return release.TagName
}

func normalizeRepoURL(url string) string {
	// Beispiele:
	// https://github.com/LPinsight/smartMirror-plugin-weather.git
	// https://github.com/LPinsight/smartMirror-plugin-weather
	// LPinsight/smartMirror-plugin-weather

	url = strings.TrimSpace(url)
	url = strings.TrimSuffix(url, ".git")

	// Entferne Prefix
	url = strings.TrimPrefix(url, "https://github.com/")
	url = strings.TrimPrefix(url, "http://github.com/")
	url = strings.TrimPrefix(url, "github.com/")

	return url
}

func InstallPlugin(w http.ResponseWriter, r *http.Request) {
	var data iface.PluginData
	if err := json.NewDecoder(r.Body).Decode(&data); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	err := pluginService.Install(data.Repository)
	if err != nil {
		writeJSON(w, err.Error(), http.StatusBadRequest)
		return
	}

	writeJSON(w, "Plugin installed successfully", http.StatusOK)
}

func RemovePlugin(w http.ResponseWriter, r *http.Request) {
	var data iface.PluginData
	if err := json.NewDecoder(r.Body).Decode(&data); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	err := pluginService.Remove(data.Name)
	if err != nil {
		writeJSON(w, err.Error(), http.StatusBadRequest)
		return
	}

	writeJSON(w, "Plugin removed successfully", http.StatusOK)
}

func UpdatePlugin(w http.ResponseWriter, r *http.Request) {
	var data iface.PluginData
	if err := json.NewDecoder(r.Body).Decode(&data); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	err := pluginService.Update(data.Repository)
	if err != nil {
		writeJSON(w, err.Error(), http.StatusBadRequest)
		return
	}

	writeJSON(w, "Plugin updated successfully", http.StatusOK)
}
