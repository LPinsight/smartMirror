import { Component, OnDestroy, OnInit } from '@angular/core';
import { DatabaseStatus, DatabaseConfig, DatabaseSettings } from '../../_interface/database';
import { WebsocketConnectionState, WebsocketStatus } from '../../_interface/websocket';
import { DatabaseService } from '../../_service/database.service';
import { WebSocketService } from '../../_service/webSocket.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-template-system-settings',
  templateUrl: './template-system-settings.component.html',
  styleUrls: ['./template-system-settings.component.scss'],
  standalone: false
})
export class TemplateSystemSettingsComponent implements OnInit, OnDestroy {
  private webSocketStatusSubscription?: Subscription
  private websocketClientCountTimer?: ReturnType<typeof setInterval>
  
  private readonly maxDatabaseStatusFailures = 5
  private databaseStatusFailures = 0
  private databaseStatusTimer?: ReturnType<typeof setInterval>

  public databaseStatus: DatabaseStatus = {
    configured: false,
    status: 'not_configured'
  }

  public websocketStatus: WebsocketStatus = {
    status: 'not_configured',
    clients: 0
  }

  public databaseConfig: DatabaseConfig = {
    user: '',
    password: '',
    host: '',
    port: '3306',
    name: ''
  }

  public databaseSettings?: DatabaseSettings
  public databaseTestStatus?: DatabaseStatus
  public testingDatabase = false;
  public savingDatabase = false;
  public reconnectingDatabase = false;

  constructor(
    private databaseService: DatabaseService,
    private webSocketService: WebSocketService
  ) { }

  ngOnInit() {
    this.loadDatabaseStatus();
    this.loadDatabaseConfig();

    this.webSocketStatusSubscription = this.webSocketService.connectionStatus$.subscribe(status => {
      this.websocketStatus = {
        ...this.websocketStatus,
        status
      }

      if (status === 'connected' ) {
        this.startWebSocketStatusPolling();
      } else {
        this.stopWebSocketStatusPolling();
      }
    })

    this.loadWebSocketStatus();
  }

  ngOnDestroy() {
    this.webSocketStatusSubscription?.unsubscribe()
    this.stopWebSocketStatusPolling()
    this.stopDatabaseStatusPolling()
  }

  public loadDatabaseStatus(): void {
    this.databaseService.getStatus().subscribe({
      next: status => {
        this.databaseStatus = status

        if (status.status === 'connected') {
          this.databaseStatusFailures = 0;
          this.startDatabaseStatusPolling()
          return
        }

        if (status.status === 'not_configured') {
          this.databaseStatusFailures = 0
          this.stopDatabaseStatusPolling()
          return
        }

        this.handleDatabaseStatusFailure(status)
      },
      error: () => {
        this.handleDatabaseStatusFailure({
          configured: true,
          status: 'error',
          message: 'DB-Status konnte nicht geladen werden'
        })
      }
    })
  }

  public loadDatabaseConfig(): void {
    this.databaseService.getConfig().subscribe({
      next: settings => {
      this.databaseSettings = settings;

      this.databaseConfig = {
        user: settings.user ?? '',
        host: settings.host ?? '',
        port: settings.port || '3306',
        name: settings.name ?? '',
        // Passwort wird aus Sicherheitsgründen nicht von der API geliefert.
        password: ''
      };
    },
    error: () => {
      this.databaseSettings = undefined;
    }
  });
  }

  private startWebSocketStatusPolling() {
    if (this.websocketClientCountTimer) {
      return
    }

    this.loadWebSocketStatus();

    this.websocketClientCountTimer = setInterval(() => {
      this.loadWebSocketStatus();
    }, 5000);
  }

  private stopWebSocketStatusPolling(): void {
    if (!this.websocketClientCountTimer) {
      return;
    }

    clearInterval(this.websocketClientCountTimer);
    this.websocketClientCountTimer = undefined;
  }

  public loadWebSocketStatus(): void {
    this.webSocketService.getServerStatus().subscribe({
      next: serverStatus => {
        this.websocketStatus = {
          ... this.websocketStatus,
          clients: serverStatus.clients,
          message: serverStatus.message
        }
      },
      error: () => {
        this.websocketStatus = {
          status: 'error',
          clients: 0,
          message: 'WebSocket-Status konnte nicht geladen werden'
        };
      }
    });
  }

  public reconnectDatabase() {

  }

  public saveDatabaseConfig() {

  }

  public testDatabaseConnection() {
    this.testingDatabase = true
    this.databaseTestStatus = undefined

    this.databaseService.testConnection(this.databaseConfig).subscribe({
      next: status => {
        this.databaseTestStatus = status;
        this.testingDatabase = false;
      },
      error: error => {
        this.databaseTestStatus = error.error ?? {
          configured: true,
          status: 'error',
          message: 'Verbindungstest fehlgeschlagen'
        };
        this.testingDatabase = false;
      }
    })
  }

  public retryWebSocket() {
    this.webSocketService.retryNow();
  }

  private handleDatabaseStatusFailure(status: DatabaseStatus) {
    this.databaseStatusFailures++

    if (this.databaseStatusFailures >= this.maxDatabaseStatusFailures) {
      this.stopDatabaseStatusPolling();
      this.databaseStatus = {
        ...status,
        message: `Statusprüfung nach ${this.maxDatabaseStatusFailures} fehlgeschlagenen Versuchen pausiert.`
      };

      return;
    }

    this.databaseStatus = status
    this.startDatabaseStatusPolling()
  }

  private startDatabaseStatusPolling() {
    if (this.databaseStatusTimer) {
      return
    }

    this.databaseStatusTimer = setInterval(() => {
      this.loadDatabaseStatus();
    }, 5000)
  }

  private stopDatabaseStatusPolling() {
    if (!this.databaseStatusTimer) {
      return
    }

    clearInterval(this.databaseStatusTimer)
    this.databaseStatusTimer = undefined
  }
}
