import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable, tap } from "rxjs";
import { Plugin } from "@interface/widget";

@Injectable({ providedIn: 'root' })
export class PluginService {
  pluginsSubject = new BehaviorSubject<Plugin[]>([]);
  plugins$ = this.pluginsSubject.asObservable();

  private URL: string = 'http://localhost:8080/'
  private loaded: Set<string> = new Set();

  constructor(private http: HttpClient) {}

  public getPlugins(): Observable<Plugin[]> {
    return this.http.get<Plugin[]>(this.URL + 'plugins').pipe(
      tap(plugins => this.pluginsSubject.next(plugins))
    );
  }

  public getPluginData(pluginName: string, endpoint: string): Observable<any> {
    const url = `${this.URL}plugins/${pluginName}${endpoint}`;
    return this.http.get(url, { headers: { 'Content-Type': 'application/json' } });
  }

  public getPluginByName(name: string) {
    return this.pluginsSubject.getValue().find(p => p.name === name);
  }

  // async loadScript(url: string): Promise<void> {
  //   if (this.loaded.has(url)) return;
  //   await new Promise<void>((resolve, reject) => {
  //     const script = document.createElement('script');
  //     script.src = url;
  //     script.type = 'module';
  //     script.onload = () => {
  //       this.loaded.add(url);
  //       resolve();
  //     };
  //     script.onerror = reject;
  //     document.head.appendChild(script);
  //   });
  // }



  // installPlugin(pluginFolder: string) {
  //   return this.http.post('/api/plugins/install', { folder: pluginFolder });
  // }
}
