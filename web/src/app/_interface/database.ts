export type DatabaseConnectionState =
  | 'connected'
  | 'error'
  | 'not_configured';

export interface DatabaseStatus {
  configured: boolean;
  status: DatabaseConnectionState;
  message?: string;
}

export interface DatabaseConfig {
  user: string;
  password: string;
  host: string;
  port: string;
  name: string;
}

export interface DatabaseSettings {
  configured: boolean;
  user: string;
  host: string;
  port: string;
  name: string;
  passwordConfigured: boolean;
}