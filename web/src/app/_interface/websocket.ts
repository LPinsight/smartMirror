export type WebsocketConnectionState =
  | 'connected'
  | 'error'
  | 'not_configured';

export interface WebsocketStatus {
  status: WebsocketConnectionState;
  clients: number;
  message?: string;
}
