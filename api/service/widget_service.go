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

type WidgetService struct {
	db            *gorm.DB
	pluginService *PluginService
}

// Konstruktor
func NewWidgetService(db *gorm.DB, PluginService *PluginService) *WidgetService {
	return &WidgetService{
		db:            db,
		pluginService: PluginService,
	}
}

// Alle Widgets abrufen
func (s *WidgetService) GetAll(display *models.Display) []*iface.Widget {
	widgets := make([]*iface.Widget, len(display.Widgets))

	for i, w := range display.Widgets {
		widgets[i] = db.ToIfaceWidget(&w)
	}

	return widgets
}

// Einzelnes Widget abrufen
func (s *WidgetService) GetByID(display *models.Display, widgetID string) (*iface.Widget, error) {
	widget, err := s.SearchWidget(widgetID, display.DisplayID)
	if err != nil {
		return nil, err
	}

	return db.ToIfaceWidget(widget), nil
}

// Widget erstellen
func (s *WidgetService) Create(data iface.WidgetData, displayID string) (*iface.Widget, error) {
	pluginConfig, _ := s.pluginService.GetConfig(data.PluginName)
	config := make(map[string]interface{})
	for _, opt := range pluginConfig {
		config[opt.Name] = opt.Default
	}

	configBytes, _ := json.Marshal(config)
	// api, _ := s.pluginService.GetAPI(data.PluginName)

	widget := &models.Widget{
		WidgetID:   utils.NewWidgetID(),
		DisplayID:  displayID,
		Name:       data.Name,
		PluginName: data.PluginName,
		PointStart: &models.Point{X: data.PointStart.X, Y: data.PointStart.Y},
		PointEnd:   &models.Point{X: data.PointEnd.X, Y: data.PointEnd.Y},
		Config:     datatypes.JSON(configBytes),
	}

	if err := s.db.Create(widget).Error; err != nil {
		return nil, err
	}

	return db.ToIfaceWidget(widget), nil
}

// ####################################################
// #                                                  #
// #                      assets                      #
// #                                                  #
// ####################################################

func (s *WidgetService) SearchWidget(widgetID string, displayID string) (*models.Widget, error) {
	var widget models.Widget

	if err := s.db.First(&widget, "widget_id = ? AND display_id = ?", widgetID, displayID).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, errors.New("widget not found")
		}
		return nil, err
	}

	return &widget, nil
}
