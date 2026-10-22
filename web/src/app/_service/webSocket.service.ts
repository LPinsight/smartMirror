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
  private readonly URL: string = API_CONFIG.websocketUrl
  private readonly URL_DB: string = API_CONFIG.databaseUrl

  private readonly maxReconnectAttempts = 5
  private reconnectAttempts = 0
  private persistebtReconnect = false
  private reconnectTimer?: ReturnType<typeof setTimeout>

  private socket!: WebSocket
  private messageSubject = new Subject<string>();

  private connectionSatusSubject = new BehaviorSubject<'connected' | 'error' | 'not_configured'>('not_configured');
  connectionStatus$ = this.connectionSatusSubject.asObservable();

  constructor(
    private toastService: ToastService,
    private http: HttpClient
  ) { }

  connect(options?: {persistent?: boolean}): void {
    if (options?.persistent !== undefined) {
      this.persistebtReconnect = options.persistent
    }

    if (
      this.socket && (
        this.socket.readyState == WebSocket.OPEN ||
        this.socket.readyState == WebSocket.CONNECTING
      )
    ) {
      return
    }

    this.socket = new WebSocket(this.URL);

    this.socket.onopen = () => {
      this.reconnectAttempts = 0
      this.connectionSatusSubject.next('connected')
    }

    this.socket.onmessage = (event) => {
      this.messageSubject.next(event.data);
    };

    this.socket.onclose = (event) => {
      this.connectionSatusSubject.next('error')
      this.scheduleReconnect()
    };

    this.socket.onerror = (event) => {
      this.connectionSatusSubject.next('error')
    }
  }

  private scheduleReconnect() {
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer)
    }

    if (!this.persistebtReconnect && this.reconnectAttempts >= this.maxReconnectAttempts) {
      return
    }

    this.reconnectAttempts++

    this.reconnectTimer = setTimeout(() => {
      this.connect()
    }, 5000)
  }

  retryNow() {
    this.reconnectAttempts = 0

    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer)
      this.reconnectTimer = undefined
    }

    this.connect()
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
