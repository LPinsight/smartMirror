package main

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"

	dp "github.com/LPinsight/smartMirror/display"
	wg "github.com/LPinsight/smartMirror/widget"
	"github.com/gorilla/mux"
)

var display *dp.Display

func main() {
	// Initialisiere das Display
	display = dp.NewDisplay(10, 10, 1)

	// Erstelle einen neuen Router
	router := mux.NewRouter()

	// Definiere die API-Endpunkte
	router.HandleFunc("/widgets", getWidgetsHandler).Methods("GET")
	router.HandleFunc("/widgets", createWidgetHandler).Methods("POST")
	router.HandleFunc("/widgets/{id}", deleteWidgetHandler).Methods("DELETE")

	// Starte den HTTP-Server
	fmt.Println("server started at http://localhost:8080")
	log.Fatal(http.ListenAndServe(":8080", router))
}

func errorToJson(err error) string {
	return fmt.Sprintf("{\"error\": \"%s\"}", err.Error())
}

// Handler für GET /widgets
func getWidgetsHandler(w http.ResponseWriter, r *http.Request) {
	widgetsMap := display.GetWidgets()
	widgets := make([]*wg.Widget, 0, len(widgetsMap))
	for _, widget := range widgetsMap {
		widgets = append(widgets, widget)
	}
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(widgets)
}

// Handler für POST /widgets
func createWidgetHandler(w http.ResponseWriter, r *http.Request) {
	var newWidget struct {
		Name       string   `json:"name"`
		PointStart wg.Point `json:"point_start"`
		PointEnd   wg.Point `json:"point_end"`
	}
	if err := json.NewDecoder(r.Body).Decode(&newWidget); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	widget := wg.NewWidget(newWidget.Name, newWidget.PointStart, newWidget.PointEnd)
	if err := display.AddWidget(widget); err != nil {
		http.Error(w, errorToJson(err), http.StatusConflict)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(widget)
}

// Handler für DELETE /widgets/{id}
func deleteWidgetHandler(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	id := vars["id"]

	widgets := display.GetWidgets()
	widget, exists := widgets[id]
	if !exists {
		http.Error(w, errorToJson(fmt.Errorf("widget with id %s not found", id)), http.StatusNotFound)
		return
	}

	if err := display.RemoveWidget(widget); err != nil {
		http.Error(w, errorToJson(err), http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusNoContent)
}
