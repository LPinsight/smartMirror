import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BehaviorSubject, catchError, forkJoin, map, Observable, of, switchMap, tap } from "rxjs";
import { Plugin, PluginConfig, PluginUpdateResult } from "@interface/widget";
import { ToastService } from "./toast.service";

@Injectable({ providedIn: 'root' })
export class PluginService {
  pluginsSubject = new BehaviorSubject<Map<string, Plugin>>(new Map());
  plugins$ = this.pluginsSubject.asObservable();

  private URL: string = '/api/'

  constructor(
    private http: HttpClient
  ) {
  }

  private waitForApiReady(): Observable<boolean> {
    return new Observable(observer => {
      const check = () => {
        this.http.get(this.URL + 'health').subscribe({
          next: () => {
            observer.next(true);
            observer.complete();
          },
          error: () => {
            setTimeout(check, 300); // alle 300ms erneut prüfen
          }
        });
      };

      check();
    });
  }

  public getPlugins(): Observable<{[key: string]: Plugin}> {
    return this.http.get<{[key: string]: Plugin}>(this.URL + 'plugins').pipe(
      tap(plugins => {
        const allePlugins: {[key: string]: Plugin} = {}

        Object.values(plugins).forEach(plugin => {
          if(plugin.name === 'SmartMirror Core') {
            allePlugins['__core__'] = plugin
          } else {
            allePlugins[plugin.name] = plugin
          }
        })

        this.pluginsSubject.next(new Map(Object.entries(allePlugins)))
      })
    );
  }

  public getPluginByName(name: string): Plugin {
    return this.pluginsSubject.getValue().get(name) as Plugin;
  }

  public getConfigByName(name: string): PluginConfig[] | undefined {
    const plugin = this.getPluginByName(name);
    if (!plugin) return undefined;
    return plugin.config
  }

  public getUiUrlByName(name: string): string {
    const plugin = this.getPluginByName(name);
    if (!plugin) return '';
    return plugin.uiUrl;
  }

  public getPluginLoaderInfo(name: string): { elementName: string; scriptUrl: string } | undefined {
    const plugin = this.getPluginByName(name);    
    if (!plugin) return undefined;  

    return {
      elementName: `${plugin.name}`,
      scriptUrl: plugin.uiUrl + '/main.js'
    };
  }

  public checkAllPluginsForUpdates() {
    return this.http.get(this.URL + 'plugins/version', {
      headers: { 'Content-Type': 'application/json' }
    }).pipe(map((res) => {
      return res
    }))
  }

  public installPlugin(name: string, url: string) {
    let json = {
      "name": name,
      "repository": url
    }

    return this.http.post<String>(this.URL + 'plugins/install', json, {
      headers: { 'Content-Type': 'application/json' }
    }).pipe(
      switchMap(() => this.waitForApiReady()),
      switchMap(() => this.getPlugins())
    )
  }

  public removePlugin(name: string, url: string) {
    let json = {
      "name": name,
      "repository": url
    }

    return this.http.post<String>(this.URL + 'plugins/remove', json, {
      headers: { 'Content-Type': 'application/json' }
    }).pipe(
      switchMap(() => this.waitForApiReady()),
      switchMap(() => this.getPlugins())
    )
  }

  public updatePlugin(name: string, url: string) {
    let json = {
      "name": name,
      "repository": url
    }

    return this.http.post<String>(this.URL + 'plugins/update', json, {
      headers: { 'Content-Type': 'application/json' }
    }).pipe(
      switchMap(() => this.waitForApiReady()),
      switchMap(() => this.getPlugins())
    )
  }
}
