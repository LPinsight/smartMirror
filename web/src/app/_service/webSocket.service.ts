import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WebSocketService {
  private URL: string = 'http://localhost:8080/ws'
  private socket!: WebSocket
  private messageSubject = new Subject<string>();

  constructor() { }

  connect(): void {
    if (this.socket && this.socket.readyState == WebSocket.OPEN) return;

    this.socket = new WebSocket(this.URL);

    this.socket.onopen = (event) => {
      console.log('WebSocket connected:', event);
    };

    this.socket.onmessage = (event) => {
      this.messageSubject.next(event.data);
    };

    this.socket.onclose = (event) => {
      console.log('WebSocket disconnected:', event);
      // setTimeout(() => this.connect(), 5000); // Reconnect after 5 seconds
    };

    this.socket.onerror = (event) => {
      console.error('WebSocket error:', event);
    }
  }

  sendMessage(msg: string) {
    if (this.socket && this.socket.readyState == WebSocket.OPEN) {
      this.socket.send(msg);
    } else {
      console.error('WebSocket ist nicht verbunden.');
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
