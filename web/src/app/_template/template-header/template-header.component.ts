import { Component, Output } from '@angular/core';
import { Display } from 'src/app/_interface/display';
import { AlertService } from 'src/app/_service/alert.service';
import { DataService } from 'src/app/_service/data.service';
import Swal, { SweetAlertOptions } from 'sweetalert2';

@Component({
  selector: 'app-template-header',
  templateUrl: './template-header.component.html',
  styleUrls: ['./template-header.component.scss']
})
export class TemplateHeaderComponent {
  @Output() selectedDisplay: string = 'D-45a1aad2-50fe-4c57-ac0b-cdd8fcbd5803'
  public displayList: Display[]

  constructor(
    public alert: AlertService,
    public data: DataService) {
    this.displayList = [{
      id: "D-45a1aad2-50fe-4c57-ac0b-cdd8fcbd5803",
      name: "smartMirror",
      width: 1080,
      height: 1920,
      columns: 8,
      rows: 15,
      point_size: 128,
      widgets: []
    }]
  }

  public async createNewDisplay(event?: any) {
    console.log(this.selectedDisplay);
    
    
    const steps= ['1', '2', '3', '4']
    const swalQueue = Swal.mixin(this.alert.MixinConfig(steps))
    const values = ['','','','']
    let currentStep

    for (currentStep = 0; currentStep < steps.length;) {
      
      const result: any = await swalQueue.fire(this.alert.newDisplayConfig(currentStep, values))
      
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
      let newDisplay = this.data.createDisplay(values[0], Number(values[1]), Number(values[2]), Number(values[3]))
      this.displayList.push(newDisplay)
    }
  }

}
