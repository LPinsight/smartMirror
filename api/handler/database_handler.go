package handler

import (
	"encoding/json"
	"net/http"

	iface "github.com/LPinsight/smartMirror/interface"
)

func GetDatabaseStatus(w http.ResponseWriter, r *http.Request) {
	if databaseService == nil {
		writeJSON(w, map[string]string{
			"configured": "false",
			"status":     "unavailable",
		}, http.StatusServiceUnavailable)
		return
	}

	writeJSON(w, databaseService.RefreshStatus(), http.StatusOK)
}

func SaveDatabaseConfig(w http.ResponseWriter, r *http.Request) {
	var config iface.DatabaseConfig

	if err := json.NewDecoder(r.Body).Decode(&config); err != nil {
		writeJSON(w, map[string]string{
			"error": "Ungültige Anfrage",
		}, http.StatusBadRequest)
		return
	}

	status, err := databaseService.Configure(config)
	if err != nil {
		writeJSON(w, status, http.StatusBadRequest)
		return
	}

	writeJSON(w, status, http.StatusOK)
}

func GetDatabaseConfig(w http.ResponseWriter, r *http.Request) {
	if databaseService == nil {
		writeJSON(w, map[string]string{
			"error": "Datenbank-Service ist nicht initialisiert",
		}, http.StatusServiceUnavailable)

		return
	}

	writeJSON(w, databaseService.GetSettings(), http.StatusOK)
}

func TestDatabaseConnection(w http.ResponseWriter, r *http.Request) {
	if databaseService == nil {
		writeJSON(w, map[string]string{
			"error": "Datenbank-Service ist nicht initialisiert",
		}, http.StatusServiceUnavailable)
		return
	}

	var config iface.DatabaseConfig
	if err := json.NewDecoder(r.Body).Decode(&config); err != nil {
		writeJSON(w, map[string]string{
			"error": "Ungültige Anfrage",
		}, http.StatusBadRequest)
		return
	}

	status, err := databaseService.TestConnection(config)
	if err != nil {
		writeJSON(w, status, http.StatusBadRequest)
		return
	}

	writeJSON(w, status, http.StatusOK)
}
