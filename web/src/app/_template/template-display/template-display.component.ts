import { Component, Input, OnInit } from '@angular/core';
import { Display } from '../../_interface/display';
import { DataService } from '../../_service/data.service';
import { ToastrService } from 'ngx-toastr';
import { AlertService } from '../../_service/alert.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-template-display',
  templateUrl: './template-display.component.html',
  styleUrls: ['./template-display.component.scss']
})
export class TemplateDisplayComponent implements OnInit {
  @Input()  display!: Display;
  public selected: boolean = false;

  constructor(
    private alert: AlertService,
    public data: DataService,
    private notification: ToastrService
  ) {

  }

  ngOnInit() {
    this.data.displayId$.subscribe(id => {
      if (this.display.Id == id) {
        this.selected = true        
      } else {
        this.selected = false
      }
    })
  }

  public async edit(event?: any) {
    const steps= ['1', '2', '3', '4']
    const swalQueue = Swal.mixin(this.alert.MixinConfig(steps))
    const values = [this.display.Name,
                    this.display.Height.toString(),
                    this.display.Width.toString(),
                    this.display.Point_size.toString()]
    let currentStep

    for (currentStep = 0; currentStep < steps.length;) {
      
      const result: any = await swalQueue.fire(this.alert.newDisplayConfig(currentStep, values, false))
      
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
      this.data.updateDisplay(this.display.Id, values[0], Number(values[1]), Number(values[2]), Number(values[3])).subscribe(res => {
        this.notification.success('Display wurde erfolgreich angepasst', 'Display aktualisiert', { progressBar: true })
      })
    }
  }


  public async remove(event?: any) {    
    const result = await Swal.fire(this.alert.removeDisplayConfig(this.display.Name))

    if(result.isDenied) {
      this.data.removeDisplay(this.display.Id).subscribe(res => {
        this.notification.success('Display wurde erfolgreich entfernt', 'Display entfernen', { progressBar: true })
      })
    }
  }

}
