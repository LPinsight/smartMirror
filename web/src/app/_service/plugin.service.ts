import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BehaviorSubject, catchError, forkJoin, map, Observable, of, tap } from "rxjs";
import { Plugin, PluginConfig, PluginUpdateResult } from "@interface/widget";
import { ToastService } from "./toast.service";

@Injectable({ providedIn: 'root' })
export class PluginService {
  pluginsSubject = new BehaviorSubject<Map<string, Plugin>>(new Map());
  plugins$ = this.pluginsSubject.asObservable();

  private URL: string = 'http://localhost:8080/'

  constructor(
    private http: HttpClient,
    private toastService: ToastService
  ) {}

  public getPlugins(): Observable<{[key: string]: Plugin}> {
    return this.http.get<{[key: string]: Plugin}>(this.URL + 'plugins').pipe(
      tap(plugins => {
        const corePlugin: Plugin = {
          name: 'SmartMirror Core',
          version: "",  // TODO: Version dynamisch setzen
          latest: "",
          repository: "https://github.com/LPinsight/smartMirror",
          beschreibung: "Hauptsystem des SmartMirror",
          author: "Slibbo",
          api: { port: 0, endpoints: [] },
          config: [],
          uiUrl: '',
        };

        const allePlugins = { '__core__': corePlugin, ...plugins };


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

  public checkAllPluginsForUpdates(startUp: boolean) {   
    const observables = Array.from(this.pluginsSubject.getValue().values()).map(plugin =>
      this.getLatestVersion(plugin)
    );

    forkJoin(observables).subscribe(results => {
      results.forEach(result => {
        if (!result.success && !startUp) {
          this.toastService.warning(result.error.message, `Fehler beim Überprüfen von Updates für Plugin ${result.plugin.name}`);
        }
      })

      if (results.filter(r => !r.success).length === 0 && !startUp) {
        this.toastService.success('Alle Plugins wurden auf Updates überprüft.', 'Check-Updates');
      }
      
    })
  }

  public getLatestVersion(plugin: Plugin): Observable<PluginUpdateResult> {
    if(!plugin.repository) {
      plugin.latest = plugin.version;
      return of({ plugin, success: false, error: 'Kein Repository angegeben' });
    }

    const repoPath = plugin.repository
      .replace('https://github.com/', '')
      .replace('/\/$/', '')

    const apiUrl = `https://api.github.com/repos/${repoPath}/releases/latest`;

    return this.http.get<{tag_name: string}>(apiUrl).pipe(
      map( data => {
        plugin.latest = data.tag_name;
        return { plugin, success: true, latestVersion: data.tag_name };
      }),
      catchError( error => {
        console.error('Fehler beim Abrufen der neuesten Version:', error);
        plugin.latest = plugin.version; // Fallback auf aktuelle Version bei Fehler
        return of({ plugin, success: false, error });
      })
    );
  }

  public getThisPluginVersion() {
    this.http.get<{version: string}>(this.URL + 'version').subscribe( res => {      
      this.pluginsSubject.getValue().get('__core__')!.version = res.version;
    })

    // Diese Funktion sollte die aktuelle Version des SmartMirror Core Plugins zurückgeben.
    // Hier wird ein Platzhalterwert zurückgegeben. Implementieren Sie die Logik zum Abrufen der tatsächlichen Version.

  }
}
