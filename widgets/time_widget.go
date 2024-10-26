package widgets

import "fmt"

type TimeWidget struct{}

func NewTimeWidget() *TimeWidget {
    return &TimeWidget{}
}

func (w *TimeWidget) Draw() {
    fmt.Println("Aktuelle Zeit: 12:00") // Platzhalter für Zeitanzeige
}

func (w *TimeWidget) Update(data interface{}) {
    // Datenaktualisierung logik für Zeit
}
