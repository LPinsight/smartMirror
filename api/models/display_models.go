package models

type Display struct {
	DisplayID string `gorm:"primaryKey" json:"id"` // 👈 eigene ID
	Name      string `json:"name"`
	Height    int    `json:"height"`
	Width     int    `json:"width"`
	PointSize int  `json:"point_size"`
	Active    bool `json:"active"`
	Widgets   []Widget   `gorm:"foreignKey:DisplayID"` // 🔗 1:n Beziehung
	Location *Location `gorm:"constraint:OnDelete:CASCADE;foreignKey:DisplayID;references:DisplayID"` // 1:1 Beziehung
}

type Location struct {
	DisplayID string  `gorm:"primaryKey" json:"display_id"` // 1:1 Beziehung
	Lat       float64 `json:"lat"`
	Lon       float64 `json:"lon"`
}
