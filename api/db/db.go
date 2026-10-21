package db

import (
	"encoding/json"
	"fmt"

	iface "github.com/LPinsight/smartMirror/interface"
	"github.com/LPinsight/smartMirror/models"
	"gorm.io/driver/mysql"
	"gorm.io/gorm"
)

var DB *gorm.DB

func Connect(config iface.DatabaseConfig) (*gorm.DB, error) {
	if config.User == "" ||
		config.Password == "" ||
		config.Host == "" ||
		config.Port == "" ||
		config.Name == "" {
		return nil, fmt.Errorf("Datenbankkonfiguration unvollständig")
	}

	dsn := fmt.Sprintf(
		"%s:%s@tcp(%s:%s)/%s?charset=utf8mb4&parseTime=True&loc=Local",
		config.User,
		config.Password,
		config.Host,
		config.Port,
		config.Name,
	)

	database, err := gorm.Open(mysql.Open(dsn), &gorm.Config{})
	if err != nil {
		return nil, fmt.Errorf("Verbindung zur Datenbank fehlgeschlagen")
	}

	sqlDB, err := database.DB()
	if err != nil {
		return nil, fmt.Errorf("Datenbankverbindung konnte nicht geprüft werden")
	}

	if err := sqlDB.Ping(); err != nil {
		sqlDB.Close()
		return nil, fmt.Errorf("Verbindung zur Datenbank fehlgeschlagen")
	}

	// Automatische Migration (alle Models)
	if err := database.AutoMigrate(
		&models.Display{},
		&models.Location{},
		&models.Widget{},
		// weitere Models...
	); err != nil {
		sqlDB.Close()
		return nil, fmt.Errorf("Datenbankmigration fehlgeschlagen")
	}

	return database, nil
}

func ToIfaceDisplay(m *models.Display) *iface.Display {
	if m == nil {
		return nil
	}

	d := &iface.Display{
		ID:        m.DisplayID,
		Name:      m.Name,
		Height:    m.Height,
		Width:     m.Width,
		PointSize: m.PointSize,
		Active:    m.Active,
		Columns:   m.Width / m.PointSize,
		Rows:      m.Height / m.PointSize,
	}

	if m.Location != nil {
		d.Location = &iface.Location{
			Lat: m.Location.Lat,
			Lon: m.Location.Lon,
		}
	}

	return d
}

func ToIfaceWidget(m *models.Widget) *iface.Widget {
	if m == nil {
		return nil
	}

	var config map[string]interface{}
	json.Unmarshal(m.Config, &config)

	w := &iface.Widget{
		ID:         m.WidgetID,
		Name:       m.Name,
		PluginName: m.PluginName,
		Config:     config,
	}

	if m.PointStart != nil {
		w.PointStart = &iface.Point{
			X: m.PointStart.X,
			Y: m.PointStart.Y,
		}
	}

	if m.PointEnd != nil {
		w.PointEnd = &iface.Point{
			X: m.PointEnd.X,
			Y: m.PointEnd.Y,
		}
	}

	return w
}
