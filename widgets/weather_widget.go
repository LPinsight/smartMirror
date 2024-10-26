package widgets

import "fmt"

type WeatherWidget struct{}

func NewWeatherWidget() *WeatherWidget {
    return &WeatherWidget{}
}

func (w *WeatherWidget) Draw() {
    fmt.Println("Wetter: Sonnig, 25°C") // Platzhalter für Wetteranzeige
}

func (w *WeatherWidget) Update(data interface{}) {
    // Datenaktualisierung für das Wetter
}
