package service

import (
	"errors"

	iface "github.com/LPinsight/smartMirror/interface"
	"github.com/LPinsight/smartMirror/utils"
)

type DisplayService struct {
	displays      map[string]*iface.Display
	widgetService *WidgetService
}

// Konstruktor
func NewDisplayService(WidgetService *WidgetService) *DisplayService {
	return &DisplayService{
		displays:      make(map[string]*iface.Display),
		widgetService: WidgetService,
	}
}

// Alle Displays abrufen
func (s *DisplayService) GetAll() map[string]*iface.Display {
	return s.displays
}

// Einzelnes Display abrufen
func (s *DisplayService) GetByID(id string) (*iface.Display, error) {
	d, ok := s.displays[id]
	if !ok {
		return nil, errors.New("display not found")
	}
	return d, nil
}

// Neues Display erstellen
func (s *DisplayService) Create(data iface.DisplayData) *iface.Display {
	var columns = data.Width / data.PointSize
	var rows = data.Height / data.PointSize

	display := &iface.Display{
		ID:        utils.NewDisplayID(),
		Name:      data.Name,
		Height:    data.Height,
		Width:     data.Width,
		Columns:   columns,
		Rows:      rows,
		PointSize: data.PointSize,
		Active:    false,
		Widgets:   []*iface.Widget{},
		Location:  &iface.Location{},
	}

	s.displays[display.ID] = display

	if data.Active {
		s.SetActive(display.ID)
	}
	return display
}

// Display aktualisieren
func (s *DisplayService) Update(id string, data iface.DisplayData) (*iface.Display, error) {
	d, ok := s.displays[id]
	if !ok {
		return nil, errors.New("display not found")
	}

	var columns = data.Width / data.PointSize
	var rows = data.Height / data.PointSize

	d.Name = data.Name
	d.Height = data.Height
	d.Width = data.Width
	d.Columns = columns
	d.Rows = rows
	d.PointSize = data.PointSize

	return d, nil
}

// Display löschen
func (s *DisplayService) Delete(id string) error {
	if _, ok := s.displays[id]; !ok {
		return errors.New("display not found")
	}
	delete(s.displays, id)
	return nil
}

// Standort setzen
func (s *DisplayService) SetLocation(id string, loc iface.Location) (*iface.Location, error) {
	d, ok := s.displays[id]
	if !ok {
		return nil, errors.New("display not found")
	}
	d.Location = &loc
	return &loc, nil
}

// Aktives Display setzen
func (s *DisplayService) SetActive(id string) error {
	for key, d := range s.displays {
		d.Active = key == id
	}
	return nil
}

// Widget hinzufügen
func (s *DisplayService) AddWidget(displayID string, w *iface.WidgetData) (*iface.Widget, error) {
	d, ok := s.displays[displayID]
	if !ok {
		return nil, errors.New("display not found")
	}

	// Widget über WidgetService erstellen
	widget := s.widgetService.Create(*w)

	// Widget ans Display hängen
	d.AddWidget(widget)
	return widget, nil
}

// Widget entfernen
func (s *DisplayService) RemoveWidget(displayID, widgetID string) error {
	d, ok := s.displays[displayID]
	if !ok {
		return errors.New("display not found")
	}

	for i, w := range d.Widgets {
		if w.ID == widgetID {
			d.Widgets = append(d.Widgets[:i], d.Widgets[i+1:]...)
			return nil
		}
	}

	return errors.New("widget not found")
}
