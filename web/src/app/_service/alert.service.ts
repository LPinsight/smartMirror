import { Injectable } from '@angular/core';
import { SweetAlertOptions } from 'sweetalert2';

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

  public newDisplayConfig(id: number, values: string[], neu: boolean): SweetAlertOptions {
    let title = neu ? 'new Display' : 'edit Display'

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

  public removeDisplayConfig(name: string): SweetAlertOptions {
    return {
      title: 'Display "' + name + '" entfernen',
      text: 'Soll das Display wirklich entfernt werden?',
      icon: 'question',
      showCloseButton: true,
      showDenyButton: true,
      confirmButtonText: 'Display nicht entfernen',
      denyButtonText: 'Display entfernen'
    }
  }

  public newWidgetConfig(id: number, values: string[], pluginList: {}): SweetAlertOptions {
    let title = 'Neues Widget';

    switch (id) {
      case 0: 
        return {
          title: title,
          currentProgressStep: 0,
          text: 'Plugin auswählen',
          input: 'select',
          inputOptions: pluginList,
          inputPlaceholder: 'Plugin auswählen',
          icon: 'question',
          showCloseButton: true,
          focusConfirm: false,
          inputValue: values[0]
        }
      case 1: 
        return {
          title: title,
          currentProgressStep: 1,
          text: 'Name für das Widget',
          input: 'text',
          inputPlaceholder: 'Widget Name',
          icon: 'question',
          showCloseButton: true,
          showCancelButton: true,
          focusConfirm: false,
          inputValue: values[1]
        }
      default:
        return {
          title: title,
          text: 'id not found',
          icon: 'error'
        }
    }
  }

  public updateWidgetName (widgetName: string): SweetAlertOptions {
    return {
      title: 'Widget Name anpassen',
      text: 'Neuer Widget Name für "' + widgetName + '" eingeben.',
      input: 'text',
      inputPlaceholder: 'Widget Name',
      inputValue: widgetName,
      icon: 'question',
      showCloseButton: true,
      showDenyButton: true,
      confirmButtonText: 'Name anpassen',
      denyButtonText: 'Abbruch'
    }
  }

  public addLocationConfig(displayName: string): SweetAlertOptions {
    return {
      title: 'Standort hinzufügen',
      text: 'Soll der Standort wirklich im Display "' + displayName + '" gespeichert werden?',
      icon: 'question',
      showCloseButton: true,
      showDenyButton: true,
      confirmButtonText: 'Standort speichern',
      denyButtonText: 'Standort nicht speichern'
    }
  }

  public removeLocationConfig(displayName: string): SweetAlertOptions {
    return {
      title: 'Standort entfernen',
      text: 'Soll der Standort wirklich vom Display "' + displayName + '" entfernt werden?',
      icon: 'question',
      showCloseButton: true,
      showDenyButton: true,
      confirmButtonText: 'Standort nicht entfernen',
      denyButtonText: 'Standort entfernen'
    }
  }

  public activeNewDisplayConfig(displayName: string): SweetAlertOptions {
    return {
      title: 'Neues Display aktivieren',
      text: 'Soll das neue Display "' + displayName + '" gleich ausgewählt werden?',
      icon: 'question',
      showCloseButton: true,
      showDenyButton: true,
      confirmButtonText: 'Display auswählen',
      denyButtonText: 'Auswahl beibehalten'
    }
  }

}
