package handler

import (
	"encoding/json"
	"net/http"

	iface "github.com/LPinsight/smartMirror/interface"
	"github.com/LPinsight/smartMirror/service"
	"github.com/gorilla/mux"
)

var widgetService = service.NewWidgetService(pluginService)

// GET /api/widgets
func GetAllWidgets(w http.ResponseWriter, r *http.Request) {
	writeJSON(w, widgetService.GetAll(), http.StatusOK)
}

// GET /api/widgets/{id}
func GetWidgetByID(w http.ResponseWriter, r *http.Request) {
	id := mux.Vars(r)["id"]

	widget, err := widgetService.GetByID(id)
	if err != nil {
		http.Error(w, err.Error(), http.StatusNotFound)
		return
	}

	writeJSON(w, widget, http.StatusOK)
}

// POST /api/widgets
func CreateWidget(w http.ResponseWriter, r *http.Request) {
	var data iface.WidgetData
	if err := json.NewDecoder(r.Body).Decode(&data); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	widget := widgetService.Create(data)
	writeJSON(w, widget, http.StatusCreated)
}

// // PUT /api/widgets/{id}
// func UpdateWidget(w http.ResponseWriter, r *http.Request) {
// 	id := mux.Vars(r)["id"]

// 	var data iface.WidgetData
// 	if err := json.NewDecoder(r.Body).Decode(&data); err != nil {
// 		http.Error(w, err.Error(), http.StatusBadRequest)
// 		return
// 	}

// 	widget, err := widgetService.Update(id, data)
// 	if err != nil {
// 		http.Error(w, err.Error(), http.StatusNotFound)
// 		return
// 	}

// 	writeJSON(w, widget, http.StatusOK)
// }

// DELETE /api/widgets/{id}
func DeleteWidget(w http.ResponseWriter, r *http.Request) {
	id := mux.Vars(r)["id"]

	if err := widgetService.Delete(id); err != nil {
		http.Error(w, err.Error(), http.StatusNotFound)
		return
	}

	w.WriteHeader(http.StatusNoContent)
}

// PUT /api/display/{id}/widget/{id}
func UpdateWidget(w http.ResponseWriter, r *http.Request) {
	displayID := mux.Vars(r)["id"]
	widgetID := mux.Vars(r)["wid"]

	var data iface.WidgetData
	if err := json.NewDecoder(r.Body).Decode(&data); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	// widget, err := displayService.AddWidget(displayID, &widgetData)
	err := displayService.UpdateWidget(displayID, widgetID, data)
	if err != nil {
		http.Error(w, err.Error(), http.StatusNotFound)
		return
	}

	w.WriteHeader(http.StatusNoContent)
}

// PUT /api/display/{id}/widget/{id}/config
func UpdateWidgetConfig(w http.ResponseWriter, r *http.Request) {
	displayID := mux.Vars(r)["id"]
	widgetID := mux.Vars(r)["wid"]

	var data map[string]interface{}
	if err := json.NewDecoder(r.Body).Decode(&data); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	// widget, err := displayService.AddWidget(displayID, &widgetData)
	err := displayService.UpdateWidgetConfig(displayID, widgetID, data)
	if err != nil {
		http.Error(w, err.Error(), http.StatusNotFound)
		return
	}

	w.WriteHeader(http.StatusNoContent)
}
