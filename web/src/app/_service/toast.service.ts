import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class ToastService {

constructor(private toastr: ToastrService) { }

  success(message: string, title: string = 'Erfolg') {
    this.toastr.success(message, title, { progressBar: true });
  }

  error(error: any, title: string = 'Fehler') {
    let message = '';

    if (typeof error === 'string') {
      message = error;
    } else if (error?.error?.error) {
      message = error.error.error; // Backend-Go-Error
    } else if (error?.message) {
      message = error.message;
    } else {
      message = 'Ein unbekannter Fehler ist aufgetreten.';
    }

    this.toastr.error(message, title, { progressBar: true });
  }

  info(message: string, title: string = 'Info') {
    this.toastr.info(message, title, { progressBar: true });
  }

  warning(message: string, title: string = 'Warnung') {
    this.toastr.warning(message, title, { progressBar: true });
  }

}
