import { Display } from './../_interface/display';
import { Injectable } from '@angular/core';
import { Widget } from '../_interface/widget';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  private widgets: Widget[]
  private display: Display

  public getDisplay(): Display {
    return this.display
  }

  private getWidgets(): Widget[] {
    return this.widgets
  }

  public addWidget(widget: Widget): void {
    this.widgets.push(widget)
  }

  public deleteWidget(widget: Widget): void {
    this.widgets = this.widgets.filter(item => item.id !== widget.id)        
  }

  private createPlaceholderGrid(): Widget[] {
    let grid: Widget[] = []
    let id = 0

      for (let x = 1; x <= this.display.columns; x++){
        for (let y = 1; y <= this.display.rows; y++){
          grid.push({
            id: `placeholder-${id}`,
            name: 'placeholder',
            point_start: { x: x, y: y },
            point_end: { x: x+1, y: y+1 },
          })
          id++
        }
      }
    
    return grid
  }

  public createGrid(): Widget[] {
    return this.widgets.concat(this.createPlaceholderGrid())
  }

  public updateDisplay(d: Display): Display {
    this.display = {
      width: d.width,
      height: d.height,
      columns: d.columns,
      rows: d.rows,
      point_size: d.point_size,
      grid: this.createGrid(),
    }
    
    return this.display
  }

  constructor() {
    this.display = {
      width: 1080,
      height: 1080,
      columns: 8,
      rows: 8,
      point_size: 128,
    }

    this.widgets = [{
      id:"W-1a898502-8fcc-40e5-8f1d-a01c8ca4c6b5",
      name: "header_widget",
      point_start: { x: 1, y: 1 },
      point_end: { x: 9, y: 3 },
    },{
      id:"W-2",
      name: 'wetter_widget',
      point_start: { x: 1, y: 3 },
      point_end: { x: 5, y: 6 },
    },{
      id:"W-3",
      name: 'kalender_widget',
      point_start: { x: 5, y: 3 },
      point_end: { x: 7, y: 6 },
    },{
      id:"W-4",
      name: 'kalender_widget',
      point_start: { x: 7, y: 3 },
      point_end: { x: 9, y: 6 },
    }]
  }
}