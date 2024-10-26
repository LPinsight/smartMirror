package main

import (
	"fmt"

	dp "github.com/LPinsight/smartMirror/display"
	wg "github.com/LPinsight/smartMirror/widget"
)

func main() {
	// Create display
	display := dp.NewDisplay(10, 10, 1)
	start_point := wg.Point{X: 0, Y: 0}
	end_point := wg.Point{X: 2, Y: 2}

	// Create a widget
	widget1 := wg.NewWidget("widget1", start_point, end_point)

	display.AddWidget(widget1)

	// 2
	start_point2 := wg.Point{X: 3, Y: 2}
	end_point2 := wg.Point{X: 3, Y: 3}

	// Create a widget
	widget2 := wg.NewWidget("widget2", start_point2, end_point2)

	if err := display.AddWidget(widget2); err != nil {
		panic(err)
	}

	fmt.Println(display)

	if err := display.RemoveWidget(widget1); err != nil {
		panic(err)
	}

	fmt.Println(display)
}
