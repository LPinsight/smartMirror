package config

import (
    "encoding/json"
    "fmt"
    "os"
)

type Config struct {
    DisplayBrightness int    `json:"display_brightness"`
    Location          string `json:"location"`
}

func LoadConfig(path string) Config {
    file, err := os.Open(path)
    if err != nil {
        fmt.Println("Konnte Konfigurationsdatei nicht laden:", err)
        return Config{}
    }
    defer file.Close()

    var config Config
    json.NewDecoder(file).Decode(&config)
    return config
}

func SaveConfig(path string, config Config) {
    file, _ := os.Create(path)
    defer file.Close()
    json.NewEncoder(file).Encode(config)
}
