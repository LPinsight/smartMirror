import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DatabaseConfig, DatabaseSettings, DatabaseStatus } from '../_interface/database';
import { API_CONFIG } from '../_config/api.config';

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {
  private readonly URL: string = API_CONFIG.databaseUrl

  constructor(private http: HttpClient) { }

  getStatus(): Observable<DatabaseStatus> {
    return this.http.get<DatabaseStatus>(this.URL + 'db/status')
  }

  testConnection(config: DatabaseConfig): Observable<DatabaseStatus> {
    return this.http.post<DatabaseStatus>(this.URL + 'db/test', config)
  }

  getConfig(): Observable<DatabaseSettings> {
    return this.http.get<DatabaseSettings>(this.URL + 'db/config')
  }

  saveConfig(config: DatabaseConfig): Observable<DatabaseStatus> {
    return this.http.post<DatabaseStatus>(this.URL + 'db/config', config)
  }

  reconnect(): Observable<DatabaseStatus> {
    return this.http.post<DatabaseStatus>(this.URL + 'db/reconnect', {})
  }

  
}
