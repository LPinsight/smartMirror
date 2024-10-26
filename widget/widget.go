package widget

type Point struct {
	X int
	Y int
}

type Widget struct {
	name        string
	point_start Point
	point_end   Point
}

func NewWidget(name string, point_start Point, point_end Point) *Widget {
	return &Widget{
		name:        name,
		point_start: point_start,
		point_end:   point_end,
	}
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
