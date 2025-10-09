import { Component, OnInit } from '@angular/core';
import { DataService } from '../_service/data.service';
import { Display } from '../_interface/display';

@Component({
    selector: 'app-page-settings',
    templateUrl: './page-settings.component.html',
    styleUrls: ['./page-settings.component.scss'],
    standalone: false
})
export class PageSettingsComponent implements OnInit{
  public displayList: Map<string, Display> = new Map<string, Display> 
  public selectedId: string = ''

  constructor(
    private data: DataService
  ) {

  }

  ngOnInit() {
    this.data.displays$.subscribe(displays => {
      this.displayList = displays
      
    })

    this.data.displayId$.subscribe(id => {
      this.selectedId = id
    })
  }

}
