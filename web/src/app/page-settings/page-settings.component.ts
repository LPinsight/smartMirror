import { Component, OnInit } from '@angular/core';
import { DataService } from '@service/data.service';
import { Display, Location } from '@interface/display';
import { Plugin } from '@interface/widget';
import { PluginService } from '@service/plugin.service';
import { ToastService } from '@service/toast.service';

@Component({
    selector: 'app-page-settings',
    templateUrl: './page-settings.component.html',
    styleUrls: ['./page-settings.component.scss'],
    standalone: false
})
export class PageSettingsComponent implements OnInit{
  public displayList: Map<string, Display> = new Map<string, Display> 
  // public pluginList: Plugin[] = []
  public pluginList: Map<string, Plugin> = new Map<string, Plugin>();
  public selectedId: string = ''

  constructor(
    private dataService: DataService,
    private pluginService: PluginService,
    private toastService: ToastService
  ) {

  }

  ngOnInit() {
    this.dataService.displays$.subscribe(displays => {
      this.displayList = displays
      
    })

    this.dataService.displayId$.subscribe(id => {
      this.selectedId = id
    })

    this.pluginService.plugins$.subscribe(plugins => {
      this.pluginList = plugins
    })     
  }

  public getLocation(): Location {
    let display = this.displayList.get(this.selectedId)
    if (display) return display?.location
    
    return {lat: 0, lon: 0}
  }

  public addPlugin() {
    console.log("add Plugin");
    // TODO: add Plugin logik hinzufügen
    
  }

  public checkUpdate() {
    this.pluginService.checkAllPluginsForUpdates().subscribe({
      next: (_) => {
        this.toastService.success('Alle Plugins wurden auf Updates überprüft.', 'Update-Check abgeschlossen');
        this.pluginService.getPlugins().subscribe()
      },
      error: (err) => {
        this.toastService.warning(err.error.message, 'Update-Check fehlgeschlagen');
      }
    });
  }

}
