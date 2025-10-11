package iface

type Location struct {
	Lat float64 `json:"lat"`
	Lon float64 `json:"lon"`
}

type Display struct {
	ID        string    `json:"id"`
	Name      string    `json:"name"`
	Height    int       `json:"height"`
	Width     int       `json:"width"`
	Columns   int       `json:"columns"`
	Rows      int       `json:"rows"`
	PointSize int       `json:"point_size"`
	Active    bool      `json:"active"`
	Widgets   []*Widget `json:"widgets"`
	Location  *Location `json:"location"`
	// Location  *Location `json:"location,omitempty"`
}

type DisplayData struct {
	Name      string `json:"name"`
	Height    int    `json:"height"`
	Width     int    `json:"width"`
	PointSize int    `json:"point_size"`
	Active    bool   `json:"active"`
}

func (d *Display) AddWidget(w *Widget) {
	d.Widgets = append(d.Widgets, w)
}
