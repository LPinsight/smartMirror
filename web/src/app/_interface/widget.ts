export interface Widget {
  id?: string;
  plugin_name: string;
  name: string
  point_start: point;
  point_end: point;
  config?: WidgetConfig;         // widget-spezifische Konfiguration
}

interface point {
  x: number;
  y: number;
}

export interface WidgetConfig {
  [key: string]: any;
}

export interface Plugin {
  name: string;
  version: string;
  latest: string;
	repository: string;
  beschreibung: string;
  author: string;
  uiUrl: string;
  config: PluginConfig[];
  api: PluginAPI;
}

export interface PluginConfig {
  name: string;
  placeholder: string;
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

export interface PluginUpdateResult {
  plugin: Plugin;
  success: boolean;
  latestVersion?: string;
  error?: any
}