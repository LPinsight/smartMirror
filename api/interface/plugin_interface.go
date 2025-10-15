package iface

type Plugin struct {
	Name   string                 `json:"name"`
	Config PluginConfig           `json:"config"`
	Api    map[string]interface{} `json:"api"`
	UiUrl  string                 `json:"uiUrl"`
}

// PluginConfig mappt dynamisch auf jede Config-Option
type PluginConfig map[string]ConfigOption

// ConfigOption beschreibt eine einzelne Konfigurationsoption
type ConfigOption struct {
	Name      string      `json:"name"`
	InputType interface{} `json:"inputType"` // kann string oder []string sein
	Default   interface{} `json:"default"`   // kann string, bool, float64 etc. sein
}
