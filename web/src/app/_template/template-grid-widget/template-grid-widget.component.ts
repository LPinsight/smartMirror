import { Component, EventEmitter, Input, Output } from '@angular/core';
import { eventLabel, Eventping } from '@interface/eventping';
import { PluginConfig, Widget } from '@interface/widget';
import { PluginService } from '@service/plugin.service';

@Component({
    selector: 'app-template-grid-widget',
    templateUrl: './template-grid-widget.component.html',
    styleUrls: ['./template-grid-widget.component.scss'],
    standalone: false
})
export class TemplateGridWidgetComponent {
  @Input() widget!: Widget
  @Input() editGrid!: boolean
  @Output() ping: EventEmitter<any> = new EventEmitter<any>()

  public showSettings: boolean = false
  public pluginConfig!: PluginConfig[]

  constructor(private pluginService: PluginService) {
    pluginService.getPlugins().subscribe( _ => {
      this.pluginConfig = pluginService.getConfigByName(this.widget.plugin_name) ?? []
    })
  }

  public deleteWidget(event?: any): void {
    const eventObject: Eventping = {
      label: eventLabel.delete,
      object: this.widget
    }
    this.ping.emit(eventObject)
  }

  public editWidget(event?: any): void {
    const eventObject: Eventping = {
      label: eventLabel.update,
      object: this.widget
    }
    this.ping.emit(eventObject)
  }

  public selectPlacholderWidget(event?: any): void {
    if (this.editGrid) {
      const eventObject: Eventping = {
        label: eventLabel.select,
        object: this.widget
      }
      this.ping.emit(eventObject)
    }
  }


}
