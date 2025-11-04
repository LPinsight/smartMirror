package models

import (
	"gorm.io/datatypes"
)

type Widget struct {
	WidgetID   string         `gorm:"primaryKey" json:"id"`
	DisplayID  string         `gorm:"index" json:"display_id"` // ForeignKey
	Name       string         `json:"name"`
	PluginName string         `json:"plugin_name"`
	PointStart *Point         `gorm:"embedded;embeddedPrefix:start_" json:"point_start"`
	PointEnd   *Point         `gorm:"embedded;embeddedPrefix:end_" json:"point_end"`
	Config     datatypes.JSON `json:"config"`
}

type Point struct {
	X int `json:"x"`
	Y int `json:"y"`
}
