package service

import (
	"encoding/json"
	"errors"

	"github.com/LPinsight/smartMirror/db"
	iface "github.com/LPinsight/smartMirror/interface"
	"github.com/LPinsight/smartMirror/models"
	"github.com/LPinsight/smartMirror/utils"
	"gorm.io/datatypes"
	"gorm.io/gorm"
)

type DisplayService struct {
	db *gorm.DB
	// displays      map[string]*iface.Display
	widgetService *WidgetService
}

// Konstruktor
func NewDisplayService(db *gorm.DB, WidgetService *WidgetService) *DisplayService {
	return &DisplayService{
		db: db,
		// displays:      make(map[string]*iface.Display),
		widgetService: WidgetService,
	}
}

// ####################################################
// #                                                  #
// #                     display                      #
// #                                                  #
// ####################################################

// Alle Displays abrufen
func (s *DisplayService) GetAll() ([]*iface.Display, error) {
	var displayModels []models.Display

	if err := s.db.Preload("Location").Preload("Widgets").Find(&displayModels).Error; err != nil {
		return nil, err
	}

	displays := make([]*iface.Display, len(displayModels))
	for i, display := range displayModels {
		displays[i] = db.ToIfaceDisplay(&display)
		displays[i].Widgets = s.widgetService.GetAll(&display)
	}

	return displays, nil
}

// Einzelnes Display abrufen
func (s *DisplayService) GetByID(id string) (*iface.Display, error) {
	displayModel, err := s.SearchDisplay(id)
	if err != nil {
		return nil, err
	}

	display := db.ToIfaceDisplay(displayModel)
	display.Widgets = s.widgetService.GetAll(displayModel)

	return display, nil
}

// Neues Display erstellen
func (s *DisplayService) Create(data iface.DisplayData) (*iface.Display, error) {
	displayModel := &models.Display{
		DisplayID: utils.NewDisplayID(),
		Name:      data.Name,
		Height:    data.Height,
		Width:     data.Width,
		PointSize: data.PointSize,
		Active:    data.Active,
		Location:  &models.Location{},
	}

	if err := s.db.Create(displayModel).Error; err != nil {
		return nil, err
	}

	display := db.ToIfaceDisplay(displayModel)
	display.Widgets = []*iface.Widget{}

	if data.Active {
		if err := s.SetActive(display.ID); err != nil {
			return nil, err
		}
	}
	return display, nil
}

// Display aktualisieren
func (s *DisplayService) Update(id string, data iface.DisplayData) (*iface.Display, error) {
	// Display aus DB abrufen
	display, err := s.SearchDisplay(id)
	if err != nil {
		return nil, err
	}

	// Felder aktualisieren
	display.Name = data.Name
	display.Height = data.Height
	display.Width = data.Width
	display.PointSize = data.PointSize
	display.Active = data.Active

	// Änderungen speichern
	if err := s.db.Save(&display).Error; err != nil {
		return nil, err
	}

	updated := db.ToIfaceDisplay(display)
	updated.Widgets = s.widgetService.GetAll(display)

	return updated, nil
}

// Display löschen
func (s *DisplayService) Delete(id string) error {
	result := s.db.Delete(&models.Display{}, "display_id = ?", id)
	if result.Error != nil {
		return result.Error
	}

	if result.RowsAffected == 0 {
		return errors.New("display not found")
	}

	return nil
}

// Standort setzen
func (s *DisplayService) SetLocation(id string, loc iface.Location) (*iface.Location, error) {
	// Display aus der DB abrufen, inkl. Location
	display, err := s.SearchDisplay(id)
	if err != nil {
		return nil, err
	}

	//Location setzen oder aktualisieren
	location := &models.Location{
		DisplayID: display.DisplayID,
		Lat:       loc.Lat,
		Lon:       loc.Lon,
	}

	// Save -> fügt ein, falls nicht vorhanden; update, falls vorhanden
	if err := s.db.Save(location).Error; err != nil {
		return nil, err
	}

	// Location im Display setzen
	display.Location = location

	// Model -> iface.Display konvertieren
	result := db.ToIfaceDisplay(display)
	result.Widgets = []*iface.Widget{} // TODO: Widgets aus Datenbank laden

	return result.Location, nil
}

// Aktives Display setzen
func (s *DisplayService) SetActive(id string) error {
	if err := s.db.Model(&models.Display{}).
		Where("active = ?", true).
		Update("active", false).Error; err != nil {
		return err
	}

	if err := s.db.Model(&models.Display{}).
		Where("display_id = ?", id).
		Update("active", true).Error; err != nil {
		return err
	}

	return nil
}

// ####################################################
// #                                                  #
// #                      widget                      #
// #                                                  #
// ####################################################

// Widget hinzufügen
func (s *DisplayService) AddWidget(displayID string, w *iface.WidgetData) (*iface.Widget, error) {
	display, err := s.SearchDisplay(displayID)
	if err != nil {
		return nil, err
	}

	// Widget über WidgetService erstellen
	widget, err := s.widgetService.Create(*w, display.DisplayID)
	if err != nil {
		return nil, err
	}

	return widget, nil
}

// Widget entfernen
func (s *DisplayService) RemoveWidget(displayID, widgetID string) error {
	_, err := s.SearchDisplay(displayID)
	if err != nil {
		return err
	}

	result := s.db.Delete(&models.Widget{}, "widget_id = ? AND display_id =?", widgetID, displayID)
	if result.RowsAffected == 0 {
		return errors.New("widget not found")
	}
	if result.Error != nil {
		return result.Error
	}

	return nil
}

// Widget updaten
func (s *DisplayService) UpdateWidget(displayID, widgetID string, widgetData iface.WidgetData) error {
	_, err := s.SearchDisplay(displayID)
	if err != nil {
		return err
	}

	widget, err := s.widgetService.SearchWidget(widgetID, displayID)
	if err != nil {
		return err
	}

	widget.Name = widgetData.Name

	return s.db.Save(&widget).Error
}

// Widget Config updaten
func (s *DisplayService) UpdateWidgetConfig(displayID, widgetID string, config map[string]interface{}) error {
	_, err := s.SearchDisplay(displayID)
	if err != nil {
		return err
	}

	widget, err := s.widgetService.SearchWidget(widgetID, displayID)
	if err != nil {
		return err
	}

	configBytes, err := json.Marshal(config)
	if err != nil {
		return err
	}

	widget.Config = datatypes.JSON(configBytes)
	if err := s.db.Save(&widget).Error; err != nil {
		return err
	}

	return nil
}

// ####################################################
// #                                                  #
// #                      assets                      #
// #                                                  #
// ####################################################

func (s *DisplayService) SearchDisplay(id string) (*models.Display, error) {
	var display models.Display

	if err := s.db.First(&display, "display_id = ?", id).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, errors.New("display not found")
		}
		return nil, err
	}

	return &display, nil
}
