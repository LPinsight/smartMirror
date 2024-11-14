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

type newDisplayData struct {
	Name       string `json:"name"`       // The name of the display
	Height     int    `json:"height"`     // The hight of the display in pixels
	Width      int    `json:"width"`      // The width of the display in pixels
	Point_size int    `json:"point_size"` // The size of a point in pixels
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

func UpdateDisplay(newDisplay newDisplayData, display Display) *Display {

	var columns = newDisplay.Width / newDisplay.Point_size
	var rows = newDisplay.Height / newDisplay.Point_size

	return &Display{
		Id:         display.Id,
		Name:       newDisplay.Name,
		Height:     newDisplay.Height,
		Width:      newDisplay.Width,
		Columns:    columns,
		Rows:       rows,
		Point_size: newDisplay.Point_size,
		Widgets:    display.Widgets,
		// Widgets:    make(map[string]*widget.Widget),
	}
}

// Add a Widget
func (d *Display) AddWidget(w *widget.Widget) {
	d.Widgets = append(d.Widgets, w)
}

// Remove a Widget
func (d *Display) RemoveWidget(id string) {
	for i, widget := range d.Widgets {
		if widget.Id == id {
			d.Widgets = append(d.Widgets[:i], d.Widgets[i+1:]...)
		}
	}
}

func (d *Display) GetID() string {
	return d.Id
}
