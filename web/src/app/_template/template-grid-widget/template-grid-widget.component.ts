import { Component, EventEmitter, Input, Output } from '@angular/core';
import { eventLabel, Eventping } from 'src/app/_interface/eventping';
import { Widget } from 'src/app/_interface/widget';

@Component({
  selector: 'app-template-grid-widget',
  templateUrl: './template-grid-widget.component.html',
  styleUrls: ['./template-grid-widget.component.scss']
})
export class TemplateGridWidgetComponent {
  @Input() widget!: Widget
  @Output() ping: EventEmitter<any> = new EventEmitter<any>()

  public showSettings: boolean = false

  constructor() {
  }

  public switchShowSettings(): void {    
    this.showSettings = !this.showSettings
  }

  public deleteWidget(event?: any): void {
    const eventObject: Eventping = {
      label: eventLabel.delete,
      object: this.widget
    }
    this.ping.emit(eventObject)
  }
}
