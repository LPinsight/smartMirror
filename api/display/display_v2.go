package display

import (
	"github.com/LPinsight/smartMirror/widget"
	"github.com/google/uuid"
)

type Display struct {
	Id         string           `json:id`
	Name       string           `json:name`
	Height     int              `json:height`
	Width      int              `json:width`
	Columns    int              `json:columns`
	Rows       int              `json:rows`
	Point_size int              `json:point_size`
	Widgets    []*widget.Widget `json:widgets`
	// Widgets    map[string]*widget.Widget `json:widgets`
}

func NewDisplay(name string, height int, width int, point_size int) *Display {

	var columns = width / point_size
	var rows = height / point_size

	return &Display{
		Id:         "D-" + uuid.New().String(),
		Name:       name,
		Height:     height,
		Width:      width,
		Columns:    columns,
		Rows:       rows,
		Point_size: point_size,
		Widgets:    make([]*widget.Widget, 0),
		// Widgets:    make(map[string]*widget.Widget),
	}
}

// Add a Widget
// func (d *Display) AddWidget(w *widget.Widget) {
// 	d.Widgets[w.GetID()] = w
// }

// Remove a Widget
// func (d *Display) removeWidget(w *widget.Widget) {
// 	delete(d.Widgets, w.GetID())
// }

func (d *Display) GetID() string {
	return d.Id
}
