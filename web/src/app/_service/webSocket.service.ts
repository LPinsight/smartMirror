import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { ToastService } from '@service/toast.service';
import { WebsocketConnectionState, WebsocketStatus } from '../_interface/websocket';
import { HttpClient } from '@angular/common/http';
import { API_CONFIG } from '../_config/api.config';

@Injectable({
  providedIn: 'root'
})
export class WebSocketService {
  private URL: string = API_CONFIG.websocketUrl
  private URL_DB: string = API_CONFIG.databaseUrl

  private socket!: WebSocket
  private messageSubject = new Subject<string>();

  private connectionSatusSubject = new BehaviorSubject<'connected' | 'error' | 'not_configured'>('not_configured');
  connectionStatus$ = this.connectionSatusSubject.asObservable();

  constructor(
    private toastService: ToastService,
    private http: HttpClient
  ) { }

  connect(): void {
    if (this.socket && this.socket.readyState == WebSocket.OPEN) return;

    this.socket = new WebSocket(this.URL);

    this.socket.onopen = () => {
      this.connectionSatusSubject.next('connected')
    }

    this.socket.onmessage = (event) => {
      this.messageSubject.next(event.data);
    };

    this.socket.onclose = (event) => {
      this.connectionSatusSubject.next('error')
      this.reconnect()
    };

    this.socket.onerror = (event) => {
      this.connectionSatusSubject.next('error')
      this.reconnect()
    }
  }

  private reconnect(delay = 5000) {
      setTimeout(() => this.connect(), delay); // Reconnect after 5 seconds
  }

  sendMessage(msg: string) {    
    if (this.socket && this.socket.readyState == WebSocket.OPEN) {
      this.socket.send(msg);
      
    } else {
      this.toastService.warning('WebSocket ist nicht verbunden.', 'WebSocket-Fehler');
    }
  }

  onMessage(): Observable<string> {
    return this.messageSubject.asObservable();
  }

  disconnect() {
    if (this.socket) {
      this.socket.close();
    }
  }

  getServerStatus(): Observable<WebsocketStatus> {
    return this.http.get<WebsocketStatus>( this.URL_DB + 'ws/status')
  }
}
