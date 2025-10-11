package main

import (
	"fmt"
	"log"
	"net/http"

	api "github.com/LPinsight/smartMirror/router"
)

func main() {
	router := api.NewRouter()

	fmt.Println("Server started at http://localhost:8080")
	log.Fatal(http.ListenAndServe(":8080", router))
}