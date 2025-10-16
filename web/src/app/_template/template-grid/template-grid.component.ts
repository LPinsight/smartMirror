import { ToastrService } from 'ngx-toastr';
import { DataService } from './../../_service/data.service';
import { Component, ElementRef, OnInit } from '@angular/core';
import { Display } from '@interface/display';
import { eventLabel, Eventping } from '@interface/eventping';
import { Widget } from '@interface/widget';
import Swal from 'sweetalert2';
import { AlertService } from '../../_service/alert.service';
import { PluginService } from '../../_service/plugin.service';

@Component({
    selector: 'app-template-grid',
    templateUrl: './template-grid.component.html',
    styleUrls: ['./template-grid.component.scss'],
    standalone: false
})
export class TemplateGridComponent implements OnInit{
  public display: Display
  public newWidgetPosition: Widget[] = []
  public editGrid: boolean = false

  constructor(
    private alert: AlertService,
    private elRef: ElementRef,
    private dataService: DataService,
    private pluginService: PluginService,
    private notification: ToastrService
  ) {
    this.display = dataService.createDisplayPlaceholder()
  }
  
  ngOnInit() {
    this.dataService.selectedDisplay$.subscribe((data) => {
            
      if(data != undefined) {
        this.display = data
        this.createGrid()
      }      
    })
    
  }

  public updateView(): void {
    this.display = this.dataService.updateGrid(this.display, true)
    
  }

  public createGrid() {    
    this.elRef.nativeElement.style.setProperty('--grid-columns', this.display.columns)
    this.elRef.nativeElement.style.setProperty('--grid-rows', this.display.rows)
    // this.elRef.nativeElement.style.setProperty('--point-size', `${this.display.point_size}px`)
    this.elRef.nativeElement.style.setProperty('--point-size', `128px`)

    this.updateView()
  }

  public async createNewWidget (event?: any) {
    if (this.newWidgetPosition.length === 2) {
      let [x1, y1, x2, y2] = this.getCorrektNewWidgetPosition (this.newWidgetPosition)

      const steps= ['1', '2']
      const swalQueue = Swal.mixin(this.alert.MixinConfig(steps))
      const values = ['','']
      let currentStep

      const pluginMap = this.pluginService.pluginsSubject.getValue();
      if (pluginMap.size === 0) {
        Swal.fire('Keine Plugins gefunden', '', 'info');
        return;
      }
      const pluginList = Object.fromEntries(
        Array.from(pluginMap.values()).map(plugin => [plugin.name, plugin.name])
      );

      for (currentStep = 0; currentStep < steps.length;) {
        const result = await swalQueue.fire(this.alert.newWidgetConfig(currentStep, values, pluginList))
        
        if (result.value) {
          values[currentStep] = result.value
          currentStep++;
        } else if(result.dismiss === Swal.DismissReason.cancel) {
          currentStep--
        } else if (result.dismiss === Swal.DismissReason.close) {
          break;
        }
      }

      if (currentStep === steps.length) {
        this.dataService.addWidget({
          name: values[1],
          plugin_name: values[0],
          point_start: { x: x1, y: y1 },
          point_end: {x: x2, y: y2},
        }).subscribe(_ => {
          this.editGrid = false
          this.resetNewWidget()
          this.notification.success('Widget ' + values[1] +' wurde erfolgreich hinzugefügt', 'Widget Hinzufügen', { progressBar: true })
        })
      }

    } else {
      this.notification.error('Bitte wähle zwei Felder aus', "Widget Hinzufügen", { progressBar: true })
    }
  }

  private getCorrektNewWidgetPosition(pos: Widget[]): number[] {
    if (
      pos[0].point_start.x <= pos[1].point_start.x &&
      pos[0].point_start.y <= pos[1].point_start.y) {
      return [
        pos[0].point_start.x,
        pos[0].point_start.y,
        pos[1].point_end.x,
        pos[1].point_end.y,]
    } else if (
      pos[1].point_start.x <= pos[0].point_start.x &&
      pos[1].point_start.y <= pos[0].point_start.y) {

      return [
        pos[1].point_start.x,
        pos[1].point_start.y,
        pos[0].point_end.x,
        pos[0].point_end.y,]
    } else if (
      pos[0].point_start.x <= pos[1].point_end.x &&
      pos[0].point_start.y >= pos[1].point_start.y) {
        return [
          pos[0].point_start.x,
          pos[1].point_start.y,
          pos[1].point_end.x,
          pos[0].point_end.y]
    } else {
      return [
        pos[1].point_start.x,
        pos[0].point_start.y,
        pos[0].point_end.x,
        pos[1].point_end.y]
    }


    return []
  }


  public resetNewWidget(event?: any) {
    this.newWidgetPosition = []
  }

  public cancelNewWidget(event?: any) {
    this.resetNewWidget()
    this.editGrid = false
  }

  public async updateWidget(event: Eventping) {
    if (event.label === eventLabel.delete) {
      this.dataService.deleteWidget(event.object).subscribe(_ => {
        this.notification.success('Widget '+ event.object.name +' wurde erfolgreich entfernt', 'Widget Entfernt', { progressBar: true })
      })
    }

    if(event.label === eventLabel.update) {
      const result = await Swal.fire(this.alert.updateWidgetName(event.object.name))
      if(result.value) {
        event.object.name = result.value
        this.dataService.updateWidget(event.object).subscribe()        
      }
    }

    if (event.label === eventLabel.select) {
      if (this.newWidgetPosition.indexOf(event.object) === -1) {
        if (this.newWidgetPosition.length < 2) {
          this.newWidgetPosition.push(event.object)
        } else {
          this.notification.error('Bitte maximal zwei Felder auswählen', "Widget Hinzufügen", { progressBar: true })
        }
      } else {
        this.newWidgetPosition = this.newWidgetPosition.filter(item => item.id !== event.object.id)
      }
    }
    
  }

}
