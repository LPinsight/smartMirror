import { Component, ElementRef, OnInit } from '@angular/core';
import { Display } from '@interface/display';
import { Widget } from '@interface/widget';
import { DataService } from '@service/data.service';

@Component({
    selector: 'app-page-mirror',
    templateUrl: './page-mirror.component.html',
    styleUrls: ['./page-mirror.component.scss'],
    standalone: false
})
export class PageMirrorComponent implements OnInit {

  public widgets: Widget[] = []
  public display: Display

  constructor(private elRef: ElementRef, private dataService: DataService) {
    this.display = dataService.createDisplayPlaceholder()
    
    this.createGrid()
  }
  
  ngOnInit() {
  }

  public updateView(): void {
    this.display = this.dataService.updateGrid(this.display)

    console.log(this.display);
    
  }

  public createGrid() {
    this.elRef.nativeElement.style.setProperty('--grid-columns', this.display.columns)
    this.elRef.nativeElement.style.setProperty('--grid-rows', this.display.rows)
    this.elRef.nativeElement.style.setProperty('--point-size', `${this.display.point_size}px`)
    this.elRef.nativeElement.style.setProperty('--display-Height', `${this.display.height}px`)
    this.elRef.nativeElement.style.setProperty('--display-Width', `${this.display.width}px`)

    this.updateView()
  }

}
