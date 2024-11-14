import { Component, ElementRef, OnInit } from '@angular/core';
import { Display } from '../_interface/display';
import { Widget } from '../_interface/widget';
import { DataService } from '../_service/data.service';

@Component({
  selector: 'app-page-mirror',
  templateUrl: './page-mirror.component.html',
  styleUrls: ['./page-mirror.component.scss']
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
    this.elRef.nativeElement.style.setProperty('--grid-columns', this.display.Columns)
    this.elRef.nativeElement.style.setProperty('--grid-rows', this.display.Rows)
    this.elRef.nativeElement.style.setProperty('--point-size', `${this.display.Point_size}px`)
    this.elRef.nativeElement.style.setProperty('--display-Height', `${this.display.Height}px`)
    this.elRef.nativeElement.style.setProperty('--display-Width', `${this.display.Width}px`)

    this.updateView()
  }

}
