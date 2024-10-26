package main

import (
    "fmt"
    "smart_mirror/config"
    "smart_mirror/display"
    "smart_mirror/widgets"
)

func main() {
    // Konfiguration laden
    cfg := config.LoadConfig("config.json")

    // Display erstellen
    d := display.NewDisplay()

    // Widgets erstellen und zum Display hinzufügen
    timeWidget := widgets.NewTimeWidget()
    weatherWidget := widgets.NewWeatherWidget()
    newsWidget := widgets.NewNewsWidget()

    d.AddWidget(timeWidget)
    d.AddWidget(weatherWidget)
    d.AddWidget(newsWidget)

    // Render loop (vereinfachtes Beispiel)
    for {
        d.Render()
        fmt.Println("Smart Mirror aktualisiert...")
        // Pause zwischen den Aktualisierungen hinzufügen
    }
}
