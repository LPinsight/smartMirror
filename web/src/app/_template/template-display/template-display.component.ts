import { Component, Input, OnInit } from '@angular/core';
import { Display } from '@interface/display';
import { DataService } from '@service/data.service';
import { ToastrService } from 'ngx-toastr';
import { AlertService } from '@service/alert.service';
import Swal from 'sweetalert2';

@Component({
    selector: 'app-template-display',
    templateUrl: './template-display.component.html',
    styleUrls: ['./template-display.component.scss'],
    standalone: false
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
      if (this.display.id == id) {
        this.selected = true        
      } else {
        this.selected = false
      }
    })
  }

  public async edit(event?: any) {
    const steps= ['1', '2', '3', '4']
    const swalQueue = Swal.mixin(this.alert.MixinConfig(steps))
    const values = [this.display.name,
                    this.display.height.toString(),
                    this.display.width.toString(),
                    this.display.point_size.toString()]
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
      this.data.updateDisplay(this.display.id, values[0], Number(values[1]), Number(values[2]), Number(values[3])).subscribe(res => {
        this.notification.success('Display wurde erfolgreich angepasst', 'Display aktualisiert', { progressBar: true })
      })
    }
  }


  public async remove(event?: any) {    
    const result = await Swal.fire(this.alert.removeDisplayConfig(this.display.name))

    if(result.isDenied) {
      this.data.removeDisplay(this.display.id).subscribe(res => {
        this.notification.success('Display wurde erfolgreich entfernt', 'Display entfernen', { progressBar: true })
      })
    }
  }

}
