package iface

type Point struct {
	X int `json:"x"`
	Y int `json:"y"`
}

type Widget struct {
	ID         string                 `json:"id"`
	Name       string                 `json:"name"`
	PluginName string                 `json:"plugin_name"`
	PointStart *Point                 `json:"point_start"`
	PointEnd   *Point                 `json:"point_end"`
	Config     map[string]interface{} `json:"config"`
	// Api        PluginAPI              `json:"api"`
}

type WidgetData struct {
	Name       string `json:"name"`
	PluginName string `json:"plugin_name"`
	PointStart Point  `json:"point_start"`
	PointEnd   Point  `json:"point_end"`
	// Config interface{} `json:"config,omitempty"`
}
