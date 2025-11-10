package service

import (
	"errors"
	"fmt"
	"os/exec"

	iface "github.com/LPinsight/smartMirror/interface"
)

type PluginService struct {
	plugins map[string]*iface.Plugin
}

// Konstruktor
func NewPluginService() *PluginService {
	return &PluginService{
		plugins: make(map[string]*iface.Plugin),
	}
}

// Alle Plugins abrufen
func (s *PluginService) GetAll() map[string]*iface.Plugin {
	return s.plugins
}

// Einzelnes Plugin abrufen
func (s *PluginService) GetByName(name string) (*iface.Plugin, error) {
	plugin, ok := s.plugins[name]
	if !ok {
		return nil, errors.New("plugin not found")
	}
	return plugin, nil
}

// Neues Plugin erstellen
func (s *PluginService) Create(data iface.Plugin) *iface.Plugin {
	s.plugins[data.Name] = &data

	return &data
}

func (s *PluginService) GetConfig(name string) ([]iface.ConfigOption, error) {
	plugin, ok := s.plugins[name]
	if !ok {
		return nil, errors.New("plugin not found")
	}
	return plugin.Config, nil
}

// Plugin installieren
func (s *PluginService) Install(RepoURL string) error {
	fmt.Println("Installing plugin from:", RepoURL)

	// Befehl vorbereiten: ./plugin.sh install <URL>
	cmd := exec.Command("./plugin.sh", "install", RepoURL)

	// Setze Arbeitsverzeichnis auf "../cmd" (wo dein Script liegt)
	cmd.Dir = "../cmd"

	// Standardausgabe und -fehler an Go weiterleiten
	cmd.Stdout = nil
	cmd.Stderr = nil

	// Script ausführen
	output, err := cmd.CombinedOutput()
	if err != nil {
		fmt.Printf("Fehler beim Installieren: %v\n", err)
		fmt.Println(string(output))
		return err
	}

	fmt.Println(string(output))
	return nil
}

// Plugin entfernen
func (s *PluginService) Remove(name string) error {
	fmt.Println("Removing plugin:", name)

	// Befehl vorbereiten: ./plugin.sh remove <NAME>
	cmd := exec.Command("./plugin.sh", "remove", name)

	// Setze Arbeitsverzeichnis auf "../cmd" (wo dein Script liegt)
	cmd.Dir = "../cmd"

	// Standardausgabe und -fehler an Go weiterleiten
	cmd.Stdout = nil
	cmd.Stderr = nil

	// Script ausführen
	output, err := cmd.CombinedOutput()
	if err != nil {
		fmt.Printf("Fehler beim entfernen: %v\n", err)
		fmt.Println(string(output))
		return err
	}

	fmt.Println(string(output))
	return nil
}

// Plugin aktualisieren
func (s *PluginService) Update(RepoURL string) error {
	fmt.Println("Updating plugin from:", RepoURL)

	// Befehl vorbereiten: ./plugin.sh update <URL>
	cmd := exec.Command("./plugin.sh", "update", RepoURL)

	// Setze Arbeitsverzeichnis auf "../cmd" (wo dein Script liegt)
	cmd.Dir = "../cmd"

	// Standardausgabe und -fehler an Go weiterleiten
	cmd.Stdout = nil
	cmd.Stderr = nil

	// Script ausführen
	output, err := cmd.CombinedOutput()
	if err != nil {
		fmt.Printf("Fehler beim aktualisieren: %v\n", err)
		fmt.Println(string(output))
		return err
	}

	fmt.Println(string(output))
	return nil
}
