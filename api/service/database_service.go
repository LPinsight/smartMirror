package service

import (
	"os"

	"github.com/LPinsight/smartMirror/db"
	iface "github.com/LPinsight/smartMirror/interface"
	"github.com/joho/godotenv"
	"gorm.io/gorm"
)

type DatabaseService struct {
	database *gorm.DB
	status   iface.DatabaseStatus
	envPath  string
	settings iface.DatabaseSettings
}

func NewDatabaseService(envPath string) *DatabaseService {
	return &DatabaseService{
		envPath: envPath,
		status: iface.DatabaseStatus{
			Configured: false,
			Status:     "not_configured",
		},
	}
}

func (s *DatabaseService) LoadFromEnv() {
	_ = godotenv.Load(s.envPath)

	config := iface.DatabaseConfig{
		User:     os.Getenv("DB_USER"),
		Password: os.Getenv("DB_PASSWORD"),
		Host:     os.Getenv("DB_HOST"),
		Port:     os.Getenv("DB_PORT"),
		Name:     os.Getenv("DB_NAME"),
	}

	s.settings = iface.DatabaseSettings{
		Configured: config.User != "" && config.Password != "" &&
			config.Host != "" && config.Port != "" && config.Name != "",
		User:               config.User,
		Host:               config.Host,
		Port:               config.Port,
		Name:               config.Name,
		PasswordConfigured: config.Password != "",
	}

	if config.User == "" ||
		config.Password == "" ||
		config.Host == "" ||
		config.Port == "" ||
		config.Name == "" {
		s.status = iface.DatabaseStatus{
			Configured: false,
			Status:     "not_configured",
		}
		return
	}

	database, err := db.Connect(config)
	if err != nil {
		s.status = iface.DatabaseStatus{
			Configured: true,
			Status:     "error",
			Message:    err.Error(),
		}
		return
	}

	s.database = database
	s.status = iface.DatabaseStatus{
		Configured: true,
		Status:     "connected",
		Message:    "Datenbankverbindung erfolgreich",
	}
}

func (s *DatabaseService) GetStatus() iface.DatabaseStatus {
	return s.status
}

func (s *DatabaseService) Configure(config iface.DatabaseConfig) (iface.DatabaseStatus, error) {
	database, err := db.Connect(config)
	if err != nil {
		return iface.DatabaseStatus{
			Configured: true,
			Status:     "error",
			Message:    err.Error(),
		}, err
	}

	s.database = database
	s.status = iface.DatabaseStatus{
		Configured: true,
		Status:     "connected",
		Message:    "Datenbankverbindung erfolgreich",
	}

	s.settings = iface.DatabaseSettings{
		Configured:         true,
		User:               config.User,
		Host:               config.Host,
		Port:               config.Port,
		Name:               config.Name,
		PasswordConfigured: config.Password != "",
	}

	return s.status, nil
}

func (s *DatabaseService) GetSettings() iface.DatabaseSettings {
	return s.settings
}

func (s *DatabaseService) Database() *gorm.DB {
	return s.database
}

func (s *DatabaseService) TestConnection(config iface.DatabaseConfig) (iface.DatabaseStatus, error) {
	if err := db.CheckConnection(config); err != nil {
		return iface.DatabaseStatus{
			Configured: true,
			Status:     "error",
			Message:    err.Error(),
		}, err
	}

	return iface.DatabaseStatus{
		Configured: true,
		Status:     "connected",
		Message:    "Verbindungstest erfolgreich",
	}, nil
}
