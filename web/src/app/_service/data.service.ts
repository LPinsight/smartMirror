import { Display } from './../_interface/display';
import { Injectable } from '@angular/core';
import { Widget } from '../_interface/widget';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  private display_alt: Display
  private displays: Map<string, Display> = new Map<string, Display>
  private URL: string = 'http://localhost:8080/'
  
  public fetchData() {
    return this.http.get<{ [key: string]: Display }>(this.URL + 'displays')
      .pipe(map((res) => {
        let displays = new Map<string, Display> 

        for (let key in res) {
          if (res.hasOwnProperty(key)) {
            displays.set(key, res[key])
          }
        }

        return displays
      }))
    
    
    
  }



  public createDisplay(name: string, height: number, width: number, point_size: number) {
     let json = {
      "name": name,
      "width": width,
      "height": height,
      "point_size": point_size,
    }
   
    return this.http.post(this.URL + 'display', json, {
      headers: { 'Content-Type': 'application/json' }
    }).pipe(map((res) => {
      return res
    }))
  }

  public getDisplay(): Display {
    this.fetchData()
    return this.display_alt
  }

  private getWidgets(): Widget[] {
    return this.display_alt.Widgets
  }

  public addWidget(widget: Widget): void {
    this.display_alt.Widgets.push(widget)
  }

  public deleteWidget(widget: Widget): void {
    this.display_alt.Widgets = this.display_alt.Widgets.filter(item => item.id !== widget.id)        
  }

  private createPlaceholderGrid(): Widget[] {
    let grid: Widget[] = []
    let id = 0

      for (let x = 1; x <= this.display_alt.Columns; x++){
        for (let y = 1; y <= this.display_alt.Rows; y++){
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
    return this.display_alt.Widgets.concat(this.createPlaceholderGrid())
  }

  public updateDisplay(d: Display): Display {
    this.display_alt = {
      Id: d.Id,
      Name: d.Name,
      Width: d.Width,
      Height: d.Height,
      Columns: d.Columns,
      Rows: d.Rows,
      Point_size: d.Point_size,
      grid: this.createGrid(),
      Widgets: d.Widgets
    }
    
    return this.display_alt
  }

  constructor(private http: HttpClient) {
    this.display_alt = {
      Id: "D-45a1aad2-50fe-4c57-ac0b-cdd8fcbd5803",
      Name: "smartMirror",
      Width: 1080,
      Height: 1920,
      Columns: 8,
      Rows: 15,
      Point_size: 128,
      Widgets: []
      // widgets: [{
      //   id:"W-1a898502-8fcc-40e5-8f1d-a01c8ca4c6b5",
      //   name: "header_widget",
      //   point_start: { x: 1, y: 1 },
      //   point_end: { x: 9, y: 3 },
      // },{
      //   id:"W-2",
      //   name: 'wetter_widget',
      //   point_start: { x: 1, y: 3 },
      //   point_end: { x: 5, y: 6 },
      // },{
      //   id:"W-3",
      //   name: 'kalender_widget',
      //   point_start: { x: 5, y: 3 },
      //   point_end: { x: 7, y: 6 },
      // },{
      //   id:"W-4",
      //   name: 'kalender_widget',
      //   point_start: { x: 7, y: 3 },
      //   point_end: { x: 9, y: 6 },
      // }]
    }

  }
}