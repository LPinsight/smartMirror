import { Component, OnInit, Output } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Display } from '@interface/display';
import { AlertService } from '@service/alert.service';
import { DataService } from '@service/data.service';
import Swal, { SweetAlertOptions } from 'sweetalert2';

@Component({
    selector: 'app-template-header',
    templateUrl: './template-header.component.html',
    styleUrls: ['./template-header.component.scss'],
    standalone: false
})
export class TemplateHeaderComponent implements OnInit{
  public selectedDisplay: string = ''
  public displayList: Map<string, Display> = new Map<string, Display> 

  constructor(
    private alert: AlertService,
    private data: DataService,
    private notification: ToastrService) {
  }

  ngOnInit(): void {
    this.data.displays$.subscribe((displays) => {
      this.displayList = displays

      setTimeout(() => {
        const currentSelectedId = this.data.selectedIdSubject.getValue();
        if (this.displayList.has(currentSelectedId)) {
          this.selectedDisplay = currentSelectedId;
        } else {
          this.selectedDisplay = this.displayList.size > 0 ? this.displayList.keys().next().value! : '';
          this.data.setSelectedId(this.selectedDisplay)
        }
      }, 0);
      
    })
  }

  public onChangeSelection(event?: any) {
    this.data.setSelectedId(this.selectedDisplay)
  }

  public async createNewDisplay(event?: any) {    
    const steps= ['1', '2', '3', '4']
    const swalQueue = Swal.mixin(this.alert.MixinConfig(steps))
    const values = ['','','','']
    let currentStep

    for (currentStep = 0; currentStep < steps.length;) {
      
      const result: any = await swalQueue.fire(this.alert.newDisplayConfig(currentStep, values, true))
      
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
      this.data.createDisplay(values[0], Number(values[1]), Number(values[2]), Number(values[3])).subscribe(res => {
        // this.data.setSelectedId(res.Id) // neues Display auswählen
        this.notification.success('Display wurde erfolgreich hinzugefügt', 'Display Hinzufügen', { progressBar: true })
      })
    }
  }

  public trackById(index: number, item: any) {
    return item.Id;
  }

  public compareKeys(key1: any, key2: any): boolean {
    return key1 === key2;
  }
}
