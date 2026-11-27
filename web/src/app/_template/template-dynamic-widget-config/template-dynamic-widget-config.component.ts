import { Component, Input, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
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
    const group: Record<string, any> = {};

    this.configMeta.forEach(opt => {
      const value = this.widget.config?.[opt.name] ?? opt.default ?? '';

      if (opt.inputType === 'repeatable') {
        group[opt.name] = this.fb.array(
          (Array.isArray(value) ? value : [])
          .map((item: Record<string, any>) => this.createRepeatableItem(opt, item))
        )
      } else {
        group[opt.name] = this.createControl(opt,value)
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
    this.dataService.updateWidgetConfig(this.widget, this.form.value).subscribe(_ => {
      this.wsService.sendMessage('reloadMirror')
    })
  }

  // Funktion für Template, damit Array.isArray im Template funktioniert
  isArray(val: any): boolean {
    return Array.isArray(val);
  }

  private createControl(opt: PluginConfig, value: any): FormControl {
    if(opt.inputType === 'checkbox'){
      return this.fb.control(!!value)
    }

    if(opt.inputType === 'number'){
      return this.fb.control(Number(value ?? opt.default ?? 0))
    }

    if(Array.isArray(opt.inputType)){
      return this.fb.control(value ?? opt.inputType[0])
    }

    return this.fb.control(value ?? '')
  }

  private createRepeatableItem(listConfig: PluginConfig, item: Record<string, any> = {}):FormGroup {
    const group: Record<string, FormControl> = {};

    (listConfig.fields ?? []).forEach(field => {
      const value = item[field.name] ?? field.default ?? ''
      group[field.name] = this.createControl(field, value)
    });

    return this.fb.group(group)
  }

  getRepeatableArray(name: string): FormArray {
    return this.form.get(name) as FormArray
  }

  addRepeatableItem(config:PluginConfig){
    this.getRepeatableArray(config.name).push(this.createRepeatableItem(config))
  }

  removeRepeatableItem(config: PluginConfig, index: number){
    this.getRepeatableArray(config.name).removeAt(index)
  }
}
