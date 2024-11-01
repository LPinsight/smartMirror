import { Injectable } from '@angular/core';
import Swal, { SweetAlertOptions } from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class AlertService {
  static testConfig: any;

  constructor() { }

  public MixinConfig(steps: string[]): SweetAlertOptions {
    return {
      progressSteps: steps,
      confirmButtonText: 'Next &rarr;',
      cancelButtonText: '&larr; Back',
      inputAttributes: {
          required: 'true'
        },
      reverseButtons: true,
      validationMessage: 'This field is required'
    }
  }

  public newDisplayConfig(id: number, values: string[]): SweetAlertOptions {
    let title = 'new Display'

    switch (id) {
      case 0: 
        return {
          title: title,
          currentProgressStep: 0,
          showCloseButton: true,
          focusConfirm: false,
          text: 'Name for the Display',
          input: 'text',
          inputPlaceholder: 'Display Name',
          inputValue: values[0]
        }
      case 1:
        return {
          title: title,
          currentProgressStep: 1,
          showCloseButton: true,
          focusConfirm: false,
          showCancelButton: true,
          text: 'Display height in px',
          input: 'number',
          inputPlaceholder: 'Display height',
          inputValue: values[1]
        }
        case 2:
          return {
            title: title,
            currentProgressStep: 2,
            showCloseButton: true,
            focusConfirm: false,
            showCancelButton: true,
            text: 'Display width in px',
            input: 'number',
            inputPlaceholder: 'Display width',
            inputValue: values[2]
          }
        case 3:
          return {
            title: title,
            currentProgressStep: 3,
            showCloseButton: true,
            focusConfirm: false,
            showCancelButton: true,
            text: 'Display point size',
            input: 'select',
            inputOptions: {
              16: '16x16',
              32: '32x32',
              64: '64x64',
              128: '128x128',
            },
            inputPlaceholder: 'point size',
            inputValue: values[3]
          }
      default:
        return {
          title: title,
          text: 'id not found',
          icon: 'error'
        }
    }

    
  }
}
