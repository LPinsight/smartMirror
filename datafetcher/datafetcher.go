package datafetcher

import "fmt"

func FetchWeather() string {
    fmt.Println("Wetterdaten abgerufen.")
    return "Sonnig, 25°C"
}

func FetchTime() string {
    fmt.Println("Zeitdaten abgerufen.")
    return "12:00"
}

func FetchNews() string {
    fmt.Println("Nachrichtendaten abgerufen.")
    return "Heute ist ein schöner Tag!"
}
