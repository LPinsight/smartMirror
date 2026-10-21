package handler

import (
	"encoding/json"
	"net/http"

	iface "github.com/LPinsight/smartMirror/interface"
)

func GetDatabaseStatus(w http.ResponseWriter, r *http.Request) {
	status := databaseService.GetStatus()
	writeJSON(w, status, http.StatusOK)
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
