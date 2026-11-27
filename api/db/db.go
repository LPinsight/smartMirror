package db

import (
	"encoding/json"
	"fmt"
	"time"

	iface "github.com/LPinsight/smartMirror/interface"
	"github.com/LPinsight/smartMirror/models"
	"gorm.io/driver/mysql"
	"gorm.io/gorm"
)

var DB *gorm.DB

const (
	dbConnectionTimeout = 3 * time.Second
	dbRetryDelay        = 1 * time.Second
	dbMaxAttempts       = 3
)

func Connect(config iface.DatabaseConfig) (*gorm.DB, error) {
	if config.User == "" ||
		config.Password == "" ||
		config.Host == "" ||
		config.Port == "" ||
		config.Name == "" {
		return nil, fmt.Errorf("Datenbankkonfiguration unvollständig")
	}

	dsn := fmt.Sprintf(
		"%s:%s@tcp(%s:%s)/%s?charset=utf8mb4&parseTime=True&loc=Local&timeout=%s&readTimeout=%s&writeTimeout=%s",
		config.User,
		config.Password,
		config.Host,
		config.Port,
		config.Name,
		dbConnectionTimeout,
		dbConnectionTimeout,
		dbConnectionTimeout,
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

func CheckConnection(config iface.DatabaseConfig) error {
	if config.User == "" ||
		config.Password == "" ||
		config.Host == "" ||
		config.Port == "" ||
		config.Name == "" {
		return fmt.Errorf("Datenbankkonfiguration unvollständig")
	}

	dsn := fmt.Sprintf(
		"%s:%s@tcp(%s:%s)/%s?charset=utf8mb4&parseTime=True&loc=Local&timeout=%s&readTimeout=%s&writeTimeout=%s",
		config.User,
		config.Password,
		config.Host,
		config.Port,
		config.Name,
		dbConnectionTimeout,
		dbConnectionTimeout,
		dbConnectionTimeout,
	)

	var lastErr error

	for attempt := 1; attempt <= dbMaxAttempts; attempt++ {
		lastErr = checkConnectionOnce(dsn)
		if lastErr == nil {
			return nil
		}

		if attempt < dbMaxAttempts {
			time.Sleep(dbRetryDelay)
		}
	}

	return fmt.Errorf(
		"Verbindung nach %d Versuchen fehlgeschlagen: %w",
		dbMaxAttempts,
		lastErr,
	)
}

func checkConnectionOnce(dsn string) error {
	database, err := gorm.Open(mysql.Open(dsn), &gorm.Config{})
	if err != nil {
		return err
	}

	sqlDB, err := database.DB()
	if err != nil {
		return err
	}
	defer sqlDB.Close()

	return sqlDB.Ping()
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
