package service

import (
	"errors"

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

func (s *PluginService) GetConfig(name string) (iface.PluginConfig, error) {
	plugin, ok := s.plugins[name]
	if !ok {
		return nil, errors.New("plugin not found")
	}
	return plugin.Config, nil
}
