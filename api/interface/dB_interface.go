package iface

type DatabaseConfig struct {
	User     string `json:"user"`
	Password string `json:"password"`
	Host     string `json:"host"`
	Port     string `json:"port"`
	Name     string `json:"name"`
}

type DatabaseStatus struct {
	Configured bool   `json:"configured"`
	Status     string `json:"status"`
	Message    string `json:"message,omitempty"`
}
