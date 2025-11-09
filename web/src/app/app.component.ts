import { Component } from '@angular/core';
import { DataService } from '@service/data.service';
import { PluginService } from '@service/plugin.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
    standalone: false
})
export class AppComponent {

  constructor(
    private dataService: DataService,
    private pluginService: PluginService
  ) {
    dataService.getDisplays().subscribe()
    pluginService.getPlugins().subscribe()
  }
}
