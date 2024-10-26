package display

import (
	"errors"
	"slices"

	"github.com/LPinsight/smartMirror/widget"
)

type display struct {
	display_hight int // The hight of the display in pixels
	display_width int // The width of the display in pixels

	point_size int // The size of a point in pixels

	grid [][]*widget.Widget // The grid of points on the display

	widgets []*widget.Widget // The widgets on the display
}

func NewDisplay(display_hight int, display_width int, point_size int) *display {
	// Caluculate the number of points which fits in the display
	amount_hight_points := display_hight / point_size
	amount_width_points := display_width / point_size

	points := make([][]*widget.Widget, amount_width_points)
	for x := 0; x < amount_width_points; x++ {
		points[x] = make([]*widget.Widget, amount_hight_points)
	}

	return &display{
		display_hight: display_hight,
		display_width: display_width,

		point_size: point_size,

		grid: points,
	}
}

// Get the widget at the given x and y position
func (d *display) GetWidgetAtPoint(x int, y int) (*widget.Widget, error) {
	if x < 0 || x >= len(d.grid) || y < 0 || y >= len(d.grid[0]) {
		return nil, errors.New("the given x and y position is out of bounds")
	}
	return d.grid[x][y], nil
}

// Add a widget to the display
func (d *display) AddWidget(w *widget.Widget) error {
	// Check if start_point is larger than end_point
	point_start := w.GetPointStart()
	point_end := w.GetPointEnd()
	if point_start.X > point_end.X || point_start.Y > point_end.Y {
		return errors.New("the start point is larger than the end point")
	}

	// Check if the widget overlaps with other widgets
	if d.checkWidgetOverlap(w) {
		return errors.New("the widget overlaps with other widgets")
	}

	d.widgets = append(d.widgets, w)

	for x := point_start.X; x <= point_end.X; x++ {
		for y := point_start.Y; y <= point_end.Y; y++ {
			d.grid[x][y] = w
		}
	}

	return nil
}

func removeFromSlice(slice []*widget.Widget, s int) []*widget.Widget {
	return append(slice[:s], slice[s+1:]...)
}

// Remove a widget from the display
func (d *display) RemoveWidget(w *widget.Widget) error {
	// Check if the widget is on the display
	if slices.Contains(d.widgets, w) == false {
		return errors.New("the widget does not exist on the display")
	}

	// Remove the widget from grid
	point_start := w.GetPointStart()
	point_end := w.GetPointEnd()
	for x := point_start.X; x <= point_end.X; x++ {
		for y := point_start.Y; y <= point_end.Y; y++ {
			d.grid[x][y] = nil
		}
	}

	// Remove the widget from widgets
	index := -1
	for i, widget := range d.widgets {
		if widget == w {
			index = i
			break
		}
	}
	if index == -1 {
		return errors.New("the widget does not exist on the display")
	}
	d.widgets = removeFromSlice(d.widgets, index)

	return nil
}

// Check if the widget overlaps with other widgets
func (d *display) checkWidgetOverlap(w *widget.Widget) bool {
	point_start := w.GetPointStart()
	point_end := w.GetPointEnd()

	for x := point_start.X; x < point_end.X; x++ {
		for y := point_start.Y; y < point_end.Y; y++ {
			if d.grid[x][y] != nil {
				return true
			}
		}
	}

	return false
}
