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

  public widgets: Widget[] = []
  public display: Display

  constructor(public elRef: ElementRef, public dataService: DataService) {
    this.display = dataService.getDisplay()
    
    this.createGrid()
  }
  
  ngOnInit() {
  }

  public updateView(): void {
    this.display = this.dataService.updateDisplay(this.display)
  }

  public createGrid() {
    this.elRef.nativeElement.style.setProperty('--grid-columns', this.display.columns)
    this.elRef.nativeElement.style.setProperty('--grid-rows', this.display.rows)
    this.elRef.nativeElement.style.setProperty('--point-size', `${this.display.point_size}px`)

    this.updateView()
    
  }


  public updateWidget(event: Eventping) {
    if (event.label === eventLabel.delete) {
      this.dataService.deleteWidget(event.object)
      this.updateView()
    }
    
  }


}
