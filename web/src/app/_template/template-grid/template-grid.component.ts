import { Component, ElementRef, OnInit } from '@angular/core';
import { Widget } from 'src/app/_interface/widget';

@Component({
  selector: 'app-template-grid',
  templateUrl: './template-grid.component.html',
  styleUrls: ['./template-grid.component.scss']
})
export class TemplateGridComponent implements OnInit{

  public display_width: number
  public display_height: number
  public point_size: number
  // point-size value list: [16,32,64,128,256]

  public widgets: Widget[]

  constructor(public elRef: ElementRef) {
    this.display_width =  1080
    this.display_height = 1080
    this.point_size = 128

    this.widgets = [{
      id:"W-1",
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
    },{
      id:"W-X",
      name: 'placeholder',
      point_start: { x: 1, y: 6 },
      point_end: { x: 2, y: 7 },
    },{
      id:"W-X",
      name: 'placeholder',
      point_start: { x: 2, y: 6 },
      point_end: { x: 3, y: 7 },
    },{
      id:"W-X",
      name: 'placeholder',
      point_start: { x: 3, y: 6 },
      point_end: { x: 4, y: 7 },
    },{
      id:"W-X",
      name: 'placeholder',
      point_start: { x: 4, y: 6 },
      point_end: { x: 5, y: 7 },
    },{
      id:"W-X",
      name: 'placeholder',
      point_start: { x: 5, y: 6 },
      point_end: { x: 6, y: 7 },
    },{
      id:"W-X",
      name: 'placeholder',
      point_start: { x: 6, y: 6 },
      point_end: { x: 7, y: 7 },
    },{
      id:"W-X",
      name: 'placeholder',
      point_start: { x: 7, y: 6 },
      point_end: { x: 8, y: 7 },
    },{
      id:"W-X",
      name: 'placeholder',
      point_start: { x: 8, y: 6 },
      point_end: { x: 9, y: 7 },
    },{
      id:"W-X",
      name: 'placeholder',
      point_start: { x: 1, y: 7 },
      point_end: { x: 2, y: 8 },
    },{
      id:"W-X",
      name: 'placeholder',
      point_start: { x: 2, y: 7 },
      point_end: { x: 3, y: 8 },
    },{
      id:"W-X",
      name: 'placeholder',
      point_start: { x: 3, y: 7 },
      point_end: { x: 4, y: 8 },
    },{
      id:"W-X",
      name: 'placeholder',
      point_start: { x: 4, y: 7 },
      point_end: { x: 5, y: 8 },
    },{
      id:"W-X",
      name: 'placeholder',
      point_start: { x: 5, y: 7 },
      point_end: { x: 6, y: 8 },
    },{
      id:"W-X",
      name: 'placeholder',
      point_start: { x: 6, y: 7 },
      point_end: { x: 7, y: 8 },
    },{
      id:"W-X",
      name: 'placeholder',
      point_start: { x: 7, y: 7 },
      point_end: { x: 8, y: 8 },
    },{
      id:"W-X",
      name: 'placeholder',
      point_start: { x: 8, y: 7 },
      point_end: { x: 9, y: 8 },
    },{
      id:"W-X",
      name: 'placeholder',
      point_start: { x: 1, y: 8 },
      point_end: { x: 2, y: 9 },
    },{
      id:"W-X",
      name: 'placeholder',
      point_start: { x: 2, y: 8 },
      point_end: { x: 3, y: 9 },
    },{
      id:"W-X",
      name: 'placeholder',
      point_start: { x: 3, y: 8 },
      point_end: { x: 4, y: 9 },
    },{
      id:"W-X",
      name: 'placeholder',
      point_start: { x: 4, y: 8 },
      point_end: { x: 5, y: 9 },
    },{
      id:"W-X",
      name: 'placeholder',
      point_start: { x: 5, y: 8 },
      point_end: { x: 6, y: 9 },
    },{
      id:"W-X",
      name: 'placeholder',
      point_start: { x: 6, y: 8 },
      point_end: { x: 7, y: 9 },
    },{
      id:"W-X",
      name: 'placeholder',
      point_start: { x: 7, y: 8 },
      point_end: { x: 8, y: 9 },
    },{
      id:"W-X",
      name: 'placeholder',
      point_start: { x: 8, y: 8 },
      point_end: { x: 9, y: 9 },
    }]
    

    this.updateGrid(this.display_height, this.display_width, this.point_size)

    console.log(this.widgets);
    

  }
  
  ngOnInit() {
  }

  public updateGrid(height: number, width: number, size: number) {
    var amountHight = Math.floor(height / size)
    var amountWidth = Math.floor(width / size)

    this.elRef.nativeElement.style.setProperty('--grid-columns', amountWidth)
    this.elRef.nativeElement.style.setProperty('--grid-rows', amountHight)
    this.elRef.nativeElement.style.setProperty('--point-size', `${size}px`)

    console.log("breit: ",amountWidth+1, "höhe: ",amountHight+1);
    
  }



}
