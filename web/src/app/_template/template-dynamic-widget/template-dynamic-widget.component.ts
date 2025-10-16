import { Component, ElementRef, Input, OnInit } from '@angular/core';
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
    private el: ElementRef,
    private pluginService: PluginService,
  ) {}

  async ngOnInit() {
    this.pluginService.getPlugins().subscribe(async _ => {
      const info = this.pluginService.getPluginLoaderInfo(this.pluginName);
      if (!info) return console.warn('Plugin not found', this.pluginName);

      await this.loadScript(info.scriptUrl);

      const pluginEl = document.createElement(info.elementName);
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
