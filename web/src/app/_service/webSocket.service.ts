import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { ToastService } from '@service/toast.service';

@Injectable({
  providedIn: 'root'
})
export class WebSocketService {
  private URL: string = `ws://${window.location.host}/ws`
  private socket!: WebSocket
  private messageSubject = new Subject<string>();

  constructor(private toastService: ToastService) { }

  connect(): void {
    if (this.socket && this.socket.readyState == WebSocket.OPEN) return;

    this.socket = new WebSocket(this.URL);

    this.socket.onmessage = (event) => {
      this.messageSubject.next(event.data);
    };

    this.socket.onclose = (event) => {
      this.reconnect()
    };

    this.socket.onerror = (event) => {
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
}
