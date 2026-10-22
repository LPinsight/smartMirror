package handler

import "net/http"

func GetWebSocketStatus(w http.ResponseWriter, r *http.Request) {
	if webSocketService == nil {
		writeJSON(w, map[string]interface{}{
			"status":  "error",
			"clients": 0,
		}, http.StatusServiceUnavailable)
		return
	}

	writeJSON(w, map[string]interface{}{
		"status":  "connected",
		"clients": webSocketService.ClientCount(),
	}, http.StatusOK)
}
