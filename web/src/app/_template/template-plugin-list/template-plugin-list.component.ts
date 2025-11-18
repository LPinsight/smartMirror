import { Component, Input, OnInit } from '@angular/core';
import { Plugin } from '@interface/widget';
import { PluginService } from '@service/plugin.service';
import Swal from 'sweetalert2';
import { AlertService } from '@service/alert.service';
import { ToastService } from '@service/toast.service';

@Component({
  selector: 'app-template-plugin-list',
  templateUrl: './template-plugin-list.component.html',
  styleUrls: ['./template-plugin-list.component.scss'],
  standalone: false
})
export class TemplatePluginListComponent implements OnInit {
  @Input() plugin!: Plugin
  @Input() pluginKey!: string
  newVersion: boolean = false

  constructor(
    private pluginService: PluginService,
    private alertService: AlertService,
    private toastService: ToastService
  ) { }

  ngOnInit() {}

  async removePlugin() {
    const result = await Swal.fire(this.alertService.removePluginConfig(this.plugin.name));
      
    if (result.isDenied) {
      this.toastService.info(`Plugin wird entfernt.`, 'Plugin entfernen'); 
      this.pluginService.removePlugin(this.plugin.name, this.plugin.repository).subscribe({
        next: (_) => {
          this.toastService.success(`Plugin wurde erfolgreich entfernt.`, 'Plugin entfernt');
          this.pluginService.getPlugins().subscribe()
        },
        error: (err) => {
          this.toastService.error(err.error.message, 'Fehler beim Entfernen des Plugins');
        }
      });
    }
  }

  async updatePlugin() {
    const result = await Swal.fire(this.alertService.updatePluginConfig(this.plugin.name));
      
    if (result.isConfirmed) {       
      this.toastService.info(`Plugin wird aktualisiert.`, 'Plugin aktualisieren');      
      this.pluginService.updatePlugin(this.plugin.name, this.plugin.repository).subscribe({
        next: (_) => {
          this.toastService.success('Plugin wurde erfolgreich aktualisiert', 'Plugin aktualisiert');
          this.pluginService.getPlugins().subscribe()
        },
        error: (err) => {
          this.toastService.error(err.error.message, 'Fehler beim Aktualisieren des Plugins');
        }
      });
    }
  }

}
