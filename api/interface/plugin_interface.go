package iface

// Plugin beschreibt ein Plugin samt Konfiguration und API
type Plugin struct {
	Name         string         `json:"name"`
	Author       string         `json:"author"`
	Version      string         `json:"version"`
	Repository   string         `json:"repository"`
	Beschreibung string         `json:"beschreibung"`
	Config       []ConfigOption `json:"config"`
	Api          PluginAPI      `json:"api"`
	UiUrl        string         `json:"uiUrl"`
}

type PluginJSON struct {
	Name         string `json:"name"`
	Author       string `json:"author"`
	Version      string `json:"version"`
	Repository   string `json:"repository"`
	Beschreibung string `json:"beschreibung"`
	EntryPoint   string `json:"entryPoint"`
}

// ConfigOption beschreibt eine einzelne Konfigurationsoption
type ConfigOption struct {
	Name        string      `json:"name"`
	Placeholder string      `json:"placeholder"`
	InputType   interface{} `json:"inputType"` // kann string oder []string sein
	Default     interface{} `json:"default"`   // kann string, bool, float64 etc. sein
}

// PluginAPI beschreibt die API.json
type PluginAPI struct {
	Port      int              `json:"port"`
	Endpoints []PluginEndpoint `json:"endpoints"`
}

// PluginEndpoint beschreibt einen einzelnen Endpunkt
type PluginEndpoint struct {
	Path    string   `json:"path"`
	Methods []string `json:"methods"`
	Handler string   `json:"handler"`
}
