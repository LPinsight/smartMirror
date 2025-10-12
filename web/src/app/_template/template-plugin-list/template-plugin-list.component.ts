import { Component, Input, OnInit } from '@angular/core';
import { Plugin } from '@interface/widget';

@Component({
  selector: 'app-template-plugin-list',
  templateUrl: './template-plugin-list.component.html',
  styleUrls: ['./template-plugin-list.component.scss'],
  standalone: false
})
export class TemplatePluginListComponent implements OnInit {
  @Input() plugin!: Plugin
  // @Input() plugin!: string

  constructor() { }

  ngOnInit() {
  }

}
