package db

import (
	"encoding/json"
	"fmt"
	"log"
	"os"

	iface "github.com/LPinsight/smartMirror/interface"
	"github.com/LPinsight/smartMirror/models"
	"github.com/joho/godotenv"
	"gorm.io/driver/mysql"
	"gorm.io/gorm"
)

var DB *gorm.DB

func Init() {
	_ = godotenv.Load()

	user := os.Getenv("DB_USER")
	password := os.Getenv("DB_PASSWORD")
	host := os.Getenv("DB_HOST")
	port := os.Getenv("DB_PORT")
	name := os.Getenv("DB_NAME")

	dsn := fmt.Sprintf("%s:%s@tcp(%s:%s)/%s?charset=utf8mb4&parseTime=True&loc=Local", user, password, host, port, name)

	database, err := gorm.Open(mysql.Open(dsn), &gorm.Config{})
	if err != nil {
		log.Fatalf("❌ Konnte keine Verbindung zur DB aufbauen: %v", err)
	}

	// Automatische Migration (alle Models)
	err = database.AutoMigrate(
		&models.Display{},
		&models.Location{},
		&models.Widget{},
		// weitere Models...
	)
	if err != nil {
		log.Fatalf("❌ Migration fehlgeschlagen: %v", err)
	}

	DB = database
	log.Println("✅ MySQL-Verbindung steht & Migration abgeschlossen")
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
		//Api: XX,
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
