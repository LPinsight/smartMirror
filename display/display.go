package display

import (
    "fmt"
    "smart_mirror/widgets"
)

type Display struct {
    widgets []widgets.Widget
}

func NewDisplay() *Display {
    return &Display{
        widgets: make([]widgets.Widget, 0),
    }
}

func (d *Display) AddWidget(widget widgets.Widget) {
    d.widgets = append(d.widgets, widget)
}

func (d *Display) Render() {
    for _, widget := range d.widgets {
        widget.Draw()
    }
}
