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

var displayMap = make(map[string]*dp.Display)

func main() {
	// var display = dp.NewDisplay("test", 1920, 1080, 128)
	var display2 = dp.NewDisplay("smartMirror", 1920, 1080, 128)

	// displayMap[display.GetID()] = display
	displayMap[display2.GetID()] = display2

	// /\ TEST | \/ WIRK

	// Erstelle einen neuen Router
	router := mux.NewRouter()

	// Definiere die API-Endpunkte
	router.HandleFunc("/displays", getDisplaysHandler).Methods("GET")
	router.HandleFunc("/display/{id}", getDisplayHandler).Methods("GET")
	router.HandleFunc("/display", createNewDisplayHandler).Methods("POST", "OPTIONS")
	router.HandleFunc("/display/{id}", removeDisplayHandler).Methods("DELETE")
	router.HandleFunc("/display/{id}", updateDisplayHandler).Methods("PUT")

	router.HandleFunc("/display/{id}", addWidgetToDisplayHandler).Methods("POST")
	router.HandleFunc("/display/{did}/{wid}", removeWidgetFromDisplayHandler).Methods("DELETE")

	corsRouter := enableCORS(router)

	// Starte den HTTP-Server
	fmt.Println("server started at http://localhost:8080")
	log.Fatal(http.ListenAndServe(":8080", corsRouter))
}

// ##########################################################
// CORS
// ##########################################################

// Middleware zum Setzen der CORS-Header
func enableCORS(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Origin", "http://localhost:4200")
		// w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Header().Set("Access-Control-Allow-Methods", "POST, GET, OPTIONS, PUT, DELETE")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")

		// Wenn die Anfrage eine OPTIONS-Anfrage ist, geben wir einen 200-Statuscode zurück
		if r.Method == http.MethodOptions {
			w.WriteHeader(http.StatusOK)
			return
		}

		// Weitergabe an den nächsten Handler
		next.ServeHTTP(w, r)
	})
}

// ##########################################################
// Display
// ##########################################################

// Handler für GET /displays
func getDisplaysHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(displayMap)
}

// Handler für GET /display/{id}
func getDisplayHandler(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	id := vars["id"]

	if _, ok := displayMap[id]; !ok {
		// return errors.New("the Display does not exist")
		fmt.Println("The Display with the ID: " + id + " does not exist")
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(displayMap[id])
}

// Handler für POST /display
func createNewDisplayHandler(w http.ResponseWriter, r *http.Request) {
	var newDisplay struct {
		Name       string `json:"name"`       // The name of the display
		Height     int    `json:"height"`     // The hight of the display in pixels
		Width      int    `json:"width"`      // The width of the display in pixels
		Point_size int    `json:"point_size"` // The size of a point in pixels
	}

	if err := json.NewDecoder(r.Body).Decode(&newDisplay); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
	}

	// TODO: Prüfen ob alle Werte vorhanden sind!

	var display = dp.NewDisplay(newDisplay.Name, newDisplay.Height, newDisplay.Width, newDisplay.Point_size)

	displayMap[display.GetID()] = display

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(display)
}

// Handler für DELETE /display/{id}
func removeDisplayHandler(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	id := vars["id"]

	if _, ok := displayMap[id]; !ok {
		// return errors.New("the Display does not exist")
		fmt.Println("The Display with the ID: " + id + " does not exist")
		return
	}

	delete(displayMap, id)
}

// Handler für PUT /display/{id}
func updateDisplayHandler(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	id := vars["id"]

	var newDisplayData struct {
		Name       string `json:"name"`       // The name of the display
		Height     int    `json:"height"`     // The hight of the display in pixels
		Width      int    `json:"width"`      // The width of the display in pixels
		Point_size int    `json:"point_size"` // The size of a point in pixels
	}

	if err := json.NewDecoder(r.Body).Decode(&newDisplayData); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
	}

	if _, ok := displayMap[id]; !ok {
		// return errors.New("the Display does not exist")
		fmt.Println("The Display with the ID: " + id + " does not exist")
		return
	}

	// TODO: Prüfen ob alle Werte vorhanden sind!
	// TODO: Alte Widgets übernehmen ! Aktuell werden sie zurückgesetzt

	var display = dp.UpdateDisplay(newDisplayData, *displayMap[id])

	displayMap[id] = display

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(display)
}

// ##########################################################
// Widget
// ##########################################################

// Handler für POST /display/{id}
func addWidgetToDisplayHandler(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	id := vars["id"]

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
	if _, ok := displayMap[id]; !ok {
		// return errors.New("the Display does not exist")
		fmt.Println("The Display with the ID: " + id + " does not exist")
		return
	}

	displayMap[id].AddWidget(widget)

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(widget)
}

// Handler für DELETE /display/{did}/{wid}
func removeWidgetFromDisplayHandler(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	displayId := vars["did"]
	widgetId := vars["wid"]

	if _, ok := displayMap[displayId]; !ok {
		// return errors.New("the Display does not exist")
		fmt.Println("The Display with the ID: " + displayId + " does not exist")
		return
	}

	displayMap[displayId].RemoveWidget(widgetId)

}
