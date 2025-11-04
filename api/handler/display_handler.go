package handler

import (
	"encoding/json"
	"net/http"

	iface "github.com/LPinsight/smartMirror/interface"
	"github.com/gorilla/mux"
)

// GET /api/displays
func GetAllDisplaysHandler(w http.ResponseWriter, r *http.Request) {
	displays, err := displayService.GetAll()

	if err != nil {
		writeJSON(w, err.Error(), http.StatusBadRequest)
	}
	writeJSON(w, displays, http.StatusOK)
}

// GET /api/displays/{id}
func GetDisplayByIDHandler(w http.ResponseWriter, r *http.Request) {
	id := mux.Vars(r)["id"]

	display, err := displayService.GetByID(id)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	writeJSON(w, display, http.StatusOK)
}

// POST /api/displays
func CreateDisplayHandler(w http.ResponseWriter, r *http.Request) {
	var data iface.DisplayData
	if err := json.NewDecoder(r.Body).Decode(&data); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	display, err := displayService.Create(data)
	if err != nil {
		writeJSON(w, err.Error(), http.StatusBadRequest)
	}
	writeJSON(w, display, http.StatusCreated)
}

// PUT /api/displays/{id}
func UpdateDisplayHandler(w http.ResponseWriter, r *http.Request) {
	id := mux.Vars(r)["id"]

	var data iface.DisplayData
	if err := json.NewDecoder(r.Body).Decode(&data); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	display, err := displayService.Update(id, data)
	if err != nil {
		http.Error(w, err.Error(), http.StatusNotFound)
		return
	}

	writeJSON(w, display, http.StatusOK)
}

// DELETE /api/displays/{id}
func DeleteDisplayHandler(w http.ResponseWriter, r *http.Request) {
	id := mux.Vars(r)["id"]

	if err := displayService.Delete(id); err != nil {
		http.Error(w, err.Error(), http.StatusNotFound)
		return
	}

	w.WriteHeader(http.StatusNoContent)
}

// PUT /api/displays/{id}/location
func SetDisplayLocationHandler(w http.ResponseWriter, r *http.Request) {
	id := mux.Vars(r)["id"]

	var loc iface.Location
	if err := json.NewDecoder(r.Body).Decode(&loc); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	location, err := displayService.SetLocation(id, loc)
	if err != nil {
		http.Error(w, err.Error(), http.StatusNotFound)
		return
	}

	writeJSON(w, location, http.StatusOK)
}

// PUT /api/display/{id}/active
func SetActiveDisplayHandler(w http.ResponseWriter, r *http.Request) {
	id := mux.Vars(r)["id"]

	if err := displayService.SetActive(id); err != nil {
		http.Error(w, err.Error(), http.StatusNotFound)
		return
	}

	w.WriteHeader(http.StatusNoContent)
}

// POST /api/display/{id}/widget
func AddWidgetToDisplay(w http.ResponseWriter, r *http.Request) {
	displayID := mux.Vars(r)["id"]

	var widgetData iface.WidgetData
	if err := json.NewDecoder(r.Body).Decode(&widgetData); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	widget, err := displayService.AddWidget(displayID, &widgetData)
	if err != nil {
		http.Error(w, err.Error(), http.StatusNotFound)
		return
	}

	writeJSON(w, widget, http.StatusCreated)
}

// DELETE /api/display/{id}/widget/{id}
func RemoveWidgetFromDisplay(w http.ResponseWriter, r *http.Request) {
	displayID := mux.Vars(r)["id"]
	widgetID := mux.Vars(r)["wid"]

	// widget, err := displayService.AddWidget(displayID, &widgetData)
	err := displayService.RemoveWidget(displayID, widgetID)
	if err != nil {
		http.Error(w, err.Error(), http.StatusNotFound)
		return
	}

	w.WriteHeader(http.StatusNoContent)
}

// Hilfsfunktion zum einheitlichen JSON-Response
func writeJSON(w http.ResponseWriter, v any, status int) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(status)
	json.NewEncoder(w).Encode(v)
}
