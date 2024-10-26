package widget

import (
	"github.com/google/uuid"
)

type Point struct {
	X int
	Y int
}

type Widget struct {
	id          string
	name        string
	point_start Point
	point_end   Point
}

func NewWidget(name string, point_start Point, point_end Point) *Widget {
	return &Widget{
		id:          "W-" + uuid.New().String(),
		name:        name,
		point_start: point_start,
		point_end:   point_end,
	}
}

func (w *Widget) GetID() string {
	return w.id
}

func (w *Widget) GetName() string {
	return w.name
}

func (w *Widget) GetPointStart() Point {
	return w.point_start
}

func (w *Widget) GetPointEnd() Point {
	return w.point_end
}
