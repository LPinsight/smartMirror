import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-template-grid-widget',
  templateUrl: './template-grid-widget.component.html',
  styleUrls: ['./template-grid-widget.component.scss']
})
export class TemplateGridWidgetComponent {
  @Input() widgetName: string

  constructor() {
    this.widgetName=''
  }

}
