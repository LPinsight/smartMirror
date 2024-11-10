import { Display } from './../_interface/display';
import { Injectable } from '@angular/core';
import { Widget } from '../_interface/widget';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, combineLatest, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  displaysSubject = new BehaviorSubject<Map<string, Display> >(new Map());
  selectedIdSubject = new BehaviorSubject<string>('');

  displays$ = this.displaysSubject.asObservable();
  displayId$ = this.selectedIdSubject.asObservable();

  setDisplays(displays: any) {
    this.displaysSubject.next(displays)
  }

  setSelectedId(displayId: string) {
    this.selectedIdSubject.next(displayId)
  }

  selectedDisplay$ = combineLatest([this.displays$, this.displayId$]).pipe(
    map(([data, id]) => {
      return data.get(id)
    })
  )




  private display_alt: Display
  // private displays: Map<string, Display> = new Map<string, Display>
  private URL: string = 'http://localhost:8080/'
  
  public getDisplays() {
    return this.http.get<{ [key: string]: Display }>(this.URL + 'displays')
      .pipe(map((res) => {
        let displays = new Map<string, Display> 

        for (let key in res) {
          if (res.hasOwnProperty(key)) {
            displays.set(key, res[key])
          }
        }
        this.setDisplays(displays)
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
      this.getDisplays().subscribe()
      return res
    }))
  }

  public ALT_getDisplay(): Display {
    return this.display_alt
  }

  private getWidgets(): Widget[] {
    return this.display_alt.Widgets
  }

  public addWidget(widget: Widget): void {
    this.display_alt.Widgets.push(widget)

    // TODO:
    // API-Request Add Widget
    // New Display Request
  }

  public deleteWidget(widget: Widget): void {
    this.display_alt.Widgets = this.display_alt.Widgets.filter(item => item.id !== widget.id)        
  }

  private createPlaceholderGrid(dp: Display): Widget[] {
    let grid: Widget[] = []
    let id = 0

      for (let x = 1; x <= dp.Columns; x++){
        for (let y = 1; y <= dp.Rows; y++){
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

  public createGrid(widgets: Widget[], placeholder: Widget[] ): Widget[] {
    // console.log('Widgets: ',widgets.length, widgets);
    // console.log('Placeholder: ',placeholder.length, placeholder);


    if (widgets.length == undefined) {
      // console.log(2);      
      return placeholder
    } else {
      // console.log(4);      
      return widgets.concat(placeholder)
    }
  }

  public updateDisplay(d: Display): Display {   
    // console.log(d);
    
    return {
      Id: d.Id,
      Name: d.Name,
      Width: d.Width,
      Height: d.Height,
      Columns: d.Columns,
      Rows: d.Rows,
      Point_size: d.Point_size,
      grid: this.createGrid(d.Widgets, this.createPlaceholderGrid(d)),
      Widgets: d.Widgets
    }
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