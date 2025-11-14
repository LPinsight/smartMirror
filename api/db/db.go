package db

import (
	"database/sql"
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

const (
	internalUser     = "root"
	internalPassword = "example"
	internalDBName   = "smartMirror"
	internalSocket   = "/run/mysqld/mysqld.sock"
)

func Init() {
	_ = godotenv.Load()

	useInternal := os.Getenv("USE_INTERNAL_DB") == "true"

	var user, password, host, port, name string

	if useInternal {
		// interne DB -> hardcoded Werte
		user = internalUser
		password = internalPassword
		name = internalDBName

		// host/port irrelevant
		host = ""
		port = ""
	} else {
		// externe DB -> aus ENV
		user = os.Getenv("DB_USER")
		password = os.Getenv("DB_PASSWORD")
		host = os.Getenv("DB_HOST")
		port = os.Getenv("DB_PORT")
		name = os.Getenv("DB_NAME")

		if user == "" || password == "" || host == "" || port == "" || name == "" {
			log.Fatal("❌ Externe DB aktiviert, aber Variablen fehlen (DB_USER, DB_PASSWORD, DB_HOST, DB_PORT, DB_NAME)")
		}
	}

	var dsn string

	if useInternal {
		// Verbinde ohne DB
		dsn = fmt.Sprintf("%s:%s@unix(%s)/?charset=utf8mb4&parseTime=True&loc=Local",
			user, password, internalSocket)
	} else {
		dsn = fmt.Sprintf("%s:%s@tcp(%s:%s)/?charset=utf8mb4&parseTime=True&loc=Local",
			user, password, host, port)
	}

	// 1️⃣ Verbindung zur MariaDB herstellen (ohne Datenbank)
	sqlDB, err := sql.Open("mysql", dsn)
	if err != nil {
		log.Fatalf("❌ Konnte Verbindung zur DB herstellen: %v", err)
	}

	// 2️⃣ Datenbank anlegen, falls sie noch nicht existiert
	_, err = sqlDB.Exec(fmt.Sprintf("CREATE DATABASE IF NOT EXISTS `%s` CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci", name))
	if err != nil {
		log.Fatalf("❌ Konnte Datenbank nicht erstellen: %v", err)
	}

	sqlDB.Close() // Schließen der reinen SQL-Verbindung

	// 3️⃣ Verbindung mit GORM zur richtigen Datenbank
	if useInternal {
		dsn = fmt.Sprintf("%s:%s@unix(%s)/%s?charset=utf8mb4&parseTime=True&loc=Local",
			user, password, internalSocket, name)
	} else {
		dsn = fmt.Sprintf("%s:%s@tcp(%s:%s)/%s?charset=utf8mb4&parseTime=True&loc=Local",
			user, password, host, port, name)
	}

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
