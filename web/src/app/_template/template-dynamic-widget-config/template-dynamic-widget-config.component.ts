import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { PluginConfig, Widget, WidgetConfig } from '@interface/widget';
import { DataService } from '@service/data.service';
import { WebSocketService } from '../../_service/webSocket.service';
import { Display, Location } from '@interface/display';
import { filter, take } from 'rxjs';

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
    private dataService: DataService,
    private wsService: WebSocketService,
  ) {}

  ngOnInit(): void {
    this.dataService.selectedDisplay$.pipe(
      filter((display):display is Display => display != null),
      take(1)
    ).subscribe(display => {
      this.initForm(display.location)
    })
  }

  private initForm(location: Location | null | undefined) {
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

    const useSystemLocation = this.form.get('system_location')
    if (!useSystemLocation) return

    const applySystemLocation = (enabled: boolean): void => {
      if (!enabled || !location) return

      this.form.get('lat')?.setValue(String(location.lat))
      this.form.get('lon')?.setValue(String(location.lon))
    }

    applySystemLocation(useSystemLocation.value === true)
    useSystemLocation.valueChanges.subscribe(enabled => {
      applySystemLocation(enabled === true)
    })
  }

  submit() {
    console.log('Aktuelle Config:', this.form.value);
    this.dataService.updateWidgetConfig(this.widget, this.form.value).subscribe(_ => {
      this.wsService.sendMessage('reloadMirror')
    })
  }

  // Funktion für Template, damit Array.isArray im Template funktioniert
  isArray(val: any): boolean {
    return Array.isArray(val);
  }


}
