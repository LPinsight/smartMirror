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
  config: PluginConfig[];
  api: PluginAPI;
}

export interface PluginConfig {
  name: string;
  inputType: any;
  default: any;
}

export interface PluginAPI {
  port: number;
  endpoints: PluginEndpoint[];
}

export interface PluginEndpoint {
  path: string;
  methods: string[];
  handler: string;
}