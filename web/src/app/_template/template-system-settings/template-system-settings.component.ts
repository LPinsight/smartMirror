import { Component, OnInit } from '@angular/core';
import { DatabaseStatus, DatabaseConfig, DatabaseSettings } from '../../_interface/database';
import { WebsocketStatus } from '../../_interface/websocket';
import { DatabaseService } from '../../_service/database.service';
import { WebSocketService } from '../../_service/webSocket.service';

@Component({
  selector: 'app-template-system-settings',
  templateUrl: './template-system-settings.component.html',
  styleUrls: ['./template-system-settings.component.scss'],
  standalone: false
})
export class TemplateSystemSettingsComponent implements OnInit {
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
    this.loadWebSocketStatus();
  }

  public loadDatabaseStatus(): void {
    this.databaseService.getStatus().subscribe({
      next: status => this.databaseStatus = status,
      error: () => {
        this.databaseStatus = {
          configured: false,
          status: 'error',
          message: 'DB-Status konnte nicht geladen werden'
        }
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

  public loadWebSocketStatus(): void {
    this.webSocketService.getServerStatus().subscribe({
      next: status => this.websocketStatus = status,
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
}
