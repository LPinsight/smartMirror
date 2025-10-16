package api

import (
	"net/http"

	"github.com/LPinsight/smartMirror/handler"
	"github.com/gorilla/mux"
)

func NewRouter() http.Handler {
	router := mux.NewRouter()
	router.Use(enableCORS)

	// /display
	displayRouter := router.PathPrefix("/display").Subrouter()
	displayRouter.HandleFunc("", handler.CreateDisplayHandler).Methods("POST", "OPTIONS")

	// /display/<id>
	displayById := displayRouter.PathPrefix("/{id:D-[0-9a-fA-F-]+}").Subrouter()
	displayById.HandleFunc("", handler.GetDisplayByIDHandler).Methods("GET", "OPTIONS")
	displayById.HandleFunc("", handler.UpdateDisplayHandler).Methods("PUT", "OPTIONS")
	displayById.HandleFunc("", handler.DeleteDisplayHandler).Methods("DELETE", "OPTIONS")
	displayById.HandleFunc("/location", handler.SetDisplayLocationHandler).Methods("PUT", "OPTIONS")
	displayById.HandleFunc("/active", handler.SetActiveDisplayHandler).Methods("PUT", "OPTIONS")

	// /display/<id>/widget
	widgetRouter := displayById.PathPrefix("/widget").Subrouter()
	widgetRouter.HandleFunc("", handler.AddWidgetToDisplay).Methods("POST", "OPTIONS")

	// /display/<id>/widget/<wid>
	WidgetById := widgetRouter.PathPrefix("/{wid:W-[0-9a-fA-F-]+}").Subrouter()
	WidgetById.HandleFunc("", handler.RemoveWidgetFromDisplay).Methods("DELETE", "OPTIONS")
	WidgetById.HandleFunc("", handler.UpdateWidget).Methods("PUT", "OPTIONS")
	WidgetById.HandleFunc("/config", handler.UpdateWidgetConfig).Methods("PUT", "OPTIONS")

	// /displays
	displaysRouter := router.PathPrefix("/displays").Subrouter()
	displaysRouter.HandleFunc("", handler.GetAllDisplaysHandler).Methods("GET", "OPTIONS")

	RegisterPlugins(router)

	return router
}

func enableCORS(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Origin", "*")
		// w.Header().Set("Access-Control-Allow-Origin", "http://localhost:4200")
		w.Header().Set("Access-Control-Allow-Methods", "POST, GET, OPTIONS, PUT, DELETE")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")

		if r.Method == http.MethodOptions {
			w.WriteHeader(http.StatusOK)
			return
		}
		next.ServeHTTP(w, r)
	})
}
