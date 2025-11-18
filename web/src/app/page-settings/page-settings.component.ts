import { Component, OnInit } from '@angular/core';
import { DataService } from '@service/data.service';
import { Display, Location } from '@interface/display';
import { Plugin } from '@interface/widget';
import { PluginService } from '@service/plugin.service';
import { ToastService } from '@service/toast.service';
import { AlertService } from '@service/alert.service';
import Swal from 'sweetalert2';

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
    private toastService: ToastService,
    private alertService: AlertService
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

  public async addPlugin() {
    const result = await Swal.fire(this.alertService.installPluginConfig())
    
    if (result.isConfirmed) {
      this.toastService.info(`Plugin wird installiert.`, 'Plugin installieren'); 
      const pluginLink = result.value
        
        this.pluginService.installPlugin("New Plugin",pluginLink).subscribe({
          next: (_) => {
            this.toastService.success(`Plugin wurde erfolgreich installiert.`, 'Plugin installiert');
            this.pluginService.getPlugins().subscribe()
          },
          error: (err) => {
            this.toastService.error(err.error.message, 'Plugin-Installation fehlgeschlagen');
          }
        });
    }    
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
