import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { PluginConfig, Widget, WidgetConfig } from '@interface/widget';
import { DataService } from '@service/data.service';

@Component({
  selector: 'app-template-dynamic-widget-config',
  templateUrl: './template-dynamic-widget-config.component.html',
  styleUrls: ['./template-dynamic-widget-config.component.scss'],
  standalone: false
})
export class TemplateDynamicWidgetConfigComponent implements OnInit {
  @Input() configMeta!: PluginConfig[];   // Plugin-Meta-Config
  // @Input() initialValues?: WidgetConfig; // Optional: bereits gespeicherte Werte
  @Input() widget!: Widget; // Optional: widgetID

  form!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private dataService: DataService
  ) {}

  ngOnInit(): void {
    const group: any = {};

    this.configMeta.forEach(opt => {
      let value = this.widget.config?.[opt.name] ?? opt.default;

      if (opt.inputType === 'checkbox') {
        group[opt.name] = [!!value];
      } else if (opt.inputType === 'number') {
        group[opt.name] = [Number(value)];
      } else if (Array.isArray(opt.inputType)) {
        group[opt.name] = [value ?? opt.inputType[0]];
      } else {
        group[opt.name] = [value ?? ''];
      }
    });

    this.form = this.fb.group(group);
  }

  submit() {
    console.log('Aktuelle Config:', this.form.value);
    this.dataService.updateWidgetConfig(this.widget, this.form.value).subscribe()
  }

  // Funktion für Template, damit Array.isArray im Template funktioniert
  isArray(val: any): boolean {
    return Array.isArray(val);
  }


}
