import { Component, ElementRef, Input, OnInit } from '@angular/core';
import { PluginService } from '@service/plugin.service';
import { Widget } from '@interface/widget';

@Component({
  selector: 'app-template-dynamic-widget-view',
  templateUrl: './template-dynamic-widget-view.component.html',
  styleUrls: ['./template-dynamic-widget-view.component.scss'],
  standalone: false
})
export class TemplateDynamicWidgetViewComponent implements OnInit {
  @Input() widget!: Widget;
  @Input() config: any;
  
  constructor(
    private el: ElementRef,
    private pluginService: PluginService,
  ) {}

  async ngOnInit() {
    this.pluginService.getPlugins().subscribe(async _ => {
      const info = this.pluginService.getPluginLoaderInfo(this.widget.plugin_name);
      if (!info) return console.warn('Plugin not found', this.widget.plugin_name);

      await this.loadScript(info.scriptUrl);

      const pluginEl = document.createElement(info.elementName);
      (pluginEl as any).config = this.widget.config;
      this.el.nativeElement.innerHTML = '';
      this.el.nativeElement.appendChild(pluginEl);
      
    })
  }

  private loadScript(url: string): Promise<void> {
    return new Promise((resolve, reject) => {
      // Script nur laden, wenn es noch nicht existiert
      if (document.querySelector(`script[src="${url}"]`)) {
        return resolve();
      }

      const script = document.createElement('script');
      script.src = url;
      script.type = 'module';
      script.onload = () => resolve();
      script.onerror = () => reject(new Error(`Failed to load ${url}`));
      document.body.appendChild(script);
    });
  }

}
