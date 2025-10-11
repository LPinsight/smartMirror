// import { Display, Location } from './../_interface/display';
import { Injectable } from '@angular/core';
import { Widget } from '@interface/widget';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, combineLatest, map, Observable, switchMap, tap, of, from } from 'rxjs';
import { Display, Location } from '@interface/display';
import Swal from 'sweetalert2';
import { AlertService } from '@service/alert.service';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  // private displays: Map<string, Display> = new Map<string, Display>
  private URL: string = 'http://localhost:8080/'

  displaysSubject = new BehaviorSubject<Map<string, Display> >(new Map());
  selectedIdSubject = new BehaviorSubject<string>('');

  displays$ = this.displaysSubject.asObservable();
  displayId$ = this.selectedIdSubject.asObservable();

  setDisplays(displays: any) {
    this.displaysSubject.next(displays)
  }

  setSelectedId(displayId: string) {
    this.selectedIdSubject.next(displayId)
    if (displayId) {
      this.setDisplayActive(displayId).subscribe()
    }
  }

  selectedDisplay$ = combineLatest([this.displays$, this.displayId$]).pipe(
    map(([data, id]) => {
      return data.get(id)
    })
  )
  
  public getDisplays() {
    return this.http.get<{ [key: string]: Display }>(this.URL + 'displays')
      .pipe(map((res) => {
        let displays = new Map<string, Display> 

        for (let key in res) {
          if (res.hasOwnProperty(key)) {
            displays.set(key, res[key])
            if(res[key].active) {
              this.selectedIdSubject.next(key)
            }
          }
        }
        this.setDisplays(displays)
        return displays
      }))
  }

  public createDisplay(name: string, height: number, width: number, point_size: number) {
    let isFirst = this.displaysSubject.getValue().size === 0

    const obs$ = isFirst
      ? of(true)
      : from(Swal.fire(this.alert.activeNewDisplayConfig(name))).pipe(
        map(result => result.isConfirmed)
      )

    return obs$.pipe(
      switchMap(active => {        
        const json = {
          name,
          width,
          height,
          point_size,
          active
        }

        return this.http.post<Display>(this.URL + 'display', json, {
          headers: { 'Content-Type': 'application/json' }
        }).pipe(
          tap((res: Display) => this.getDisplays().subscribe(_ => {
            if (active) this.selectedIdSubject.next(res.id)
          }))
        )
      })
    )
  }

  public removeDisplay(id: string) {
    return this.http.delete<Display>(this.URL + 'display/' + id, {
      headers: { 'Content-Type': 'application/json' }
    }).pipe(map((res) => {
      this.getDisplays().subscribe()
      return res
    }))
  }

  public updateDisplay(id: string, name: string, height: number, width: number, point_size: number) {
    let json = {
      "name": name,
      "width": width,
      "height": height,
      "point_size": point_size,
    }

    return this.http.put<Display>(this.URL + 'display/' + id, json, {
      headers: { 'Content-Type': 'application/json' }
    }).pipe(map((res) => {
      this.getDisplays().subscribe()
      return res
    }))
  }

  public createDisplayPlaceholder(): Display {
    return {
      id: '',
      name: '',
      height: 0,
      width: 0,
      columns: 0,
      rows: 0,
      point_size: 0,
      active: false,
      location: {
        lat: 0,
        lon: 0
      },
      widgets: []
    }
  }

  public addWidget(widget: Widget) {
    let json = {
      "name": widget.name,
      "plugin_name": widget.plugin_name,
      "point_start": widget.point_start,
      "point_end": widget.point_end,
    }
   
    return this.http.post(this.URL + 'display/' + this.selectedIdSubject.getValue() + '/widget', json, {
      headers: { 'Content-Type': 'application/json' }
    }).pipe(map((res) => {
      this.getDisplays().subscribe()      
      return res
    }))
  }

  public deleteWidget(widget: Widget) {
    return this.http.delete(this.URL + 'display/' + this.selectedIdSubject.getValue() + '/widget/' + widget.id, {
      headers: { 'Content-Type': 'application/json' }
    }).pipe(map((res) => {
      this.getDisplays().subscribe()      
      return res
    }))
  }

  private createPlaceholderGrid(dp: Display): Widget[] {
    let grid: Widget[] = []
    let id = 0

      for (let x = 1; x <= dp.columns; x++){
        for (let y = 1; y <= dp.rows; y++){
          grid.push({
            id: `placeholder-${id}`,
            name: 'placeholder',
            plugin_name: 'placeholder',
            point_start: { x: x, y: y },
            point_end: { x: x+1, y: y+1 },
          })
          id++
        }
      }
    
    return grid
  }

  public createGrid(widgets: Widget[], placeholder: Widget[] ): Widget[] {
    if (widgets.length == undefined) {
      return placeholder
    } else {  
      return widgets.concat(placeholder)
    }
  }

  public updateGrid(d: Display, config: boolean): Display {    
    if (config) {      
      return {
        id: d.id,
        name: d.name,
        width: d.width,
        height: d.height,
        columns: d.columns,
        rows: d.rows,
        point_size: d.point_size,
        location: d.location,
        active: d.active,
        grid: this.createGrid(d.widgets, this.createPlaceholderGrid(d)),
        widgets: d.widgets
      }
    } else {
      return {
        id: d.id,
        name: d.name,
        width: d.width,
        height: d.height,
        columns: d.columns,
        rows: d.rows,
        point_size: d.point_size,
        location: d.location,
        active: d.active,
        grid: this.createGrid(d.widgets, []),
        widgets: d.widgets
      }
    }
  }

  public setLocation(location: Location): Observable<Location> {
    let json = {
      "lat": location.lat,
      "lon": location.lon
    }
   
    return this.http.put<Location>(this.URL + 'display/' + this.selectedIdSubject.getValue() + '/location', json, {
      headers: { 'Content-Type': 'application/json' }
    }).pipe(map((res: Location) => {
      this.getDisplays().subscribe()      
      return res
    }))
  }

  private setDisplayActive(displayID: string) {
   
    return this.http.put(this.URL + 'display/'+ displayID +'/active', {
      headers: { 'Content-Type': 'application/json' }
    }).pipe(map((res) => {
      this.getDisplays().subscribe()      
      return res
    }))
  }

  constructor(private http: HttpClient,
      private alert: AlertService) {
  }
}