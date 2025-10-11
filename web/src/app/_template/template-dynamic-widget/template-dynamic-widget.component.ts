import { Component, EnvironmentInjector, Input, OnInit, ViewContainerRef } from '@angular/core';
import { PluginService } from '@service/plugin.service';

@Component({
  selector: 'app-template-dynamic-widget',
  templateUrl: './template-dynamic-widget.component.html',
  styleUrls: ['./template-dynamic-widget.component.scss'],
  standalone: false
})
export class TemplateDynamicWidgetComponent implements OnInit {
  @Input() pluginName!: string;
  @Input() config: any;

  constructor(
    private vc: ViewContainerRef,
    private injector: EnvironmentInjector,
    private pluginService: PluginService,
  ) {}

  async ngOnInit() {
    // const plugin = this.pluginService.getPluginByName(this.pluginName);
    // if (!plugin) {
    //   console.warn('Plugin nicht gefunden:', this.pluginName);
    //   return;
    // }

    // // Plugin-Script laden (z. B. /plugins/weather/main.js)
    // await this.pluginService.loadScript(plugin.uiUrl);

    // // Plugin-Komponente aus globalem Scope holen
    // const module = (window as any)[plugin.name];
    // if (!module?.default) {
    //   console.error(`Plugin ${plugin.name} exportiert keine Standard-Komponente`);
    //   return;
    // }

    // // Dynamisch Komponente einfügen
    // const component = module.default;
    // this.vc.createComponent(component, { environmentInjector: this.injector });
  }

}
