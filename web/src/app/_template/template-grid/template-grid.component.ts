import { ToastrService } from 'ngx-toastr';
import { DataService } from './../../_service/data.service';
import { Component, ElementRef, OnInit } from '@angular/core';
import { Display } from 'src/app/_interface/display';
import { eventLabel, Eventping } from 'src/app/_interface/eventping';
import { Widget } from 'src/app/_interface/widget';

@Component({
  selector: 'app-template-grid',
  templateUrl: './template-grid.component.html',
  styleUrls: ['./template-grid.component.scss']
})
export class TemplateGridComponent implements OnInit{

  public display: Display
  public newWidgetPosition: Widget[] = []
  public editGrid: boolean = false

  constructor(
    public elRef: ElementRef,
    public dataService: DataService,
    public notification: ToastrService
  ) {
    this.display = dataService.getDisplay()
    
    this.createGrid()
  }
  
  ngOnInit() {
  }

  public updateView(): void {
    this.display = this.dataService.updateDisplay(this.display)
  }

  public createGrid() {
    this.elRef.nativeElement.style.setProperty('--grid-columns', this.display.Columns)
    this.elRef.nativeElement.style.setProperty('--grid-rows', this.display.Rows)
    this.elRef.nativeElement.style.setProperty('--point-size', `${this.display.Point_size}px`)

    this.updateView()
  }

  createNewWidget(event?: any) {
    if (this.newWidgetPosition.length === 2) {
     let [x1, y1, x2, y2] = this.getCorrektNewWidgetPosition (this.newWidgetPosition)

      this.dataService.addWidget({
        name: 'test',
        point_start: { x: x1, y: y1 },
        point_end: {x: x2, y: y2},
      })
      
      this.updateView()
      this.editGrid = false
      this.resetNewWidget()
      this.notification.success('Widget wurde erfolgreich hinzugefügt', 'Widget Hinzufügen', { progressBar: true })
    } else {
      console.log();
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
    } else if (pos[0].point_start.x <= pos[1].point_end.x) {
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

  public updateWidget(event: Eventping) {
    if (event.label === eventLabel.delete) {
      this.dataService.deleteWidget(event.object)
      this.updateView()
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
