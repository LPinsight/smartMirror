package widget

import (
	"github.com/google/uuid"
)

type Point struct {
	X int `json:"x"`
	Y int `json:"y"`
}

type Widget struct {
	Id          string `json:"id"`
	Name        string `json:"name"`
	Point_start Point  `json:"point_start"`
	Point_end   Point  `json:"point_end"`
}

func NewWidget(name string, point_start Point, point_end Point) *Widget {
	return &Widget{
		Id:          "W-" + uuid.New().String(),
		Name:        name,
		Point_start: point_start,
		Point_end:   point_end,
	}
}

func (w *Widget) GetID() string {
	return w.Id
}

func (w *Widget) GetName() string {
	return w.Name
}

func (w *Widget) GetPointStart() Point {
	return w.Point_start
}

func (w *Widget) GetPointEnd() Point {
	return w.Point_end
}
