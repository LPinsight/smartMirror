export interface Widget {
  id?: string;
  plugin_name: string;      // Name des Plugins
  name: string
  point_start: point;
  point_end: point;
  // config: any;         // widget-spezifische Konfiguration
}

interface point {
  x: number;
  y: number;
}

export interface Plugin {
  name: string;
  uiUrl: string;
  config: any;
}

export interface PluginConfig {
  name: string;
  inputType: any;
  default: any;
}
