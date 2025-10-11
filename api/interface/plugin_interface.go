package iface

type Plugin struct {
	Name   string                 `json:"name"`
	Config map[string]interface{} `json:"config"`
	Api    map[string]interface{} `json:"api"`
	UiUrl  string                 `json:"uiUrl"`
}
