import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable, tap } from "rxjs";
import { Plugin } from "@interface/widget";

@Injectable({ providedIn: 'root' })
export class PluginService {
  pluginsSubject = new BehaviorSubject<Map<string, Plugin>>(new Map());
  plugins$ = this.pluginsSubject.asObservable();

  private URL: string = 'http://localhost:8080/'

  constructor(private http: HttpClient) {}

  public getPlugins(): Observable<{[key: string]: Plugin}> {
    return this.http.get<{[key: string]: Plugin}>(this.URL + 'plugins').pipe(
      tap(plugins => this.pluginsSubject.next(new Map(Object.entries(plugins))))
    );
  }

  public getPluginData(pluginName: string, endpoint: string): Observable<any> {
    const url = `${this.URL}plugins/${pluginName}/api/${endpoint}`;
    return this.http.get(url, { headers: { 'Content-Type': 'application/json' } });
  }

  public getPluginByName(name: string): Plugin {
    return this.pluginsSubject.getValue().get(name) as Plugin;
  }

  public getPluginLoaderInfo(name: string): { elementName: string; scriptUrl: string } | undefined {
    const plugin = this.getPluginByName(name);
    if (!plugin) return undefined;

    return {
      elementName: `${plugin.name}-plugin`,
      scriptUrl: plugin.uiUrl.startsWith('http') ? plugin.uiUrl : `${this.URL}${plugin.uiUrl}`
    };
  }




  // installPlugin(pluginFolder: string) {
  //   return this.http.post('/api/plugins/install', { folder: pluginFolder });
  // }
}
