import { Component, Input, OnInit } from '@angular/core';
import { Plugin } from '@interface/widget';
import { PluginService } from '@service/plugin.service';

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

  constructor(private pluginService: PluginService) { }

  ngOnInit() {    
    // console.log(this.plugin.latest);
    
  }

  removePlugin() {
    // Logik zum Entfernen des Plugins
    console.log("remove " + this.plugin.name);
    // TODO: Implementieren Sie die tatsächliche Logik zum Entfernen des Plugins
  }

  updatePlugin() {
    // Logik zum Aktualisieren des Plugins
    console.log("update " + this.plugin.name);
    // TODO: Implementieren Sie die tatsächliche Logik zum Aktualisieren des Plugins
  }

}
