package service

import (
	"errors"

	iface "github.com/LPinsight/smartMirror/interface"
	"github.com/LPinsight/smartMirror/utils"
)

type WidgetService struct {
	widgets map[string]*iface.Widget
}

// Konstruktor
func NewWidgetService() *WidgetService {
	return &WidgetService{
		widgets: make(map[string]*iface.Widget),
	}
}

// Alle Widgets abrufen
func (s *WidgetService) GetAll() map[string]*iface.Widget {
	return s.widgets
}

// Einzelnes Widget abrufen
func (s *WidgetService) GetByID(id string) (*iface.Widget, error) {
	w, ok := s.widgets[id]
	if !ok {
		return nil, errors.New("widget not found")
	}
	return w, nil
}

// Widget erstellen
func (s *WidgetService) Create(data iface.WidgetData) *iface.Widget {
	widget := &iface.Widget{
		ID:         utils.NewWidgetID(),
		Name:       data.Name,
		PluginName: data.PluginName,
		// Type:        data.Type,
		PointStart: data.PointStart,
		PointEnd:   data.PointEnd,
		// RefreshRate: data.RefreshRate,
		// Config:      data.Config,
	}
	s.widgets[widget.ID] = widget
	return widget
}

// Widget aktualisieren
func (s *WidgetService) Update(id string, data iface.WidgetData) (*iface.Widget, error) {
	w, ok := s.widgets[id]
	if !ok {
		return nil, errors.New("widget not found")
	}

	w.Name = data.Name
	// w.Type = data.Type
	w.PointStart = data.PointStart
	w.PointEnd = data.PointEnd
	// w.RefreshRate = data.RefreshRate
	// w.Config = data.Config

	return w, nil
}

// Widget löschen
func (s *WidgetService) Delete(id string) error {
	if _, ok := s.widgets[id]; !ok {
		return errors.New("widget not found")
	}
	delete(s.widgets, id)
	return nil
}
