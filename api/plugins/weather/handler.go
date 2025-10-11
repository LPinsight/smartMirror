package main

import (
	"encoding/json"
	"net/http"
)

// HandlerMap exportieren
var HandlerMap = map[string]func(http.ResponseWriter, *http.Request){
	"DataHandler": DataHandler,
	"TestHandler": TestHandler,
}

// Handler-Funktionen
func DataHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]interface{}{
		"temp":      23,
		"condition": "sunny",
		"humidity":  45,
	})
}

func TestHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]interface{}{
		"message": "This is a test endpoint",
	})
}
