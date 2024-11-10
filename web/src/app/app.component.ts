import { Component } from '@angular/core';
import { DataService } from 'src/app/_service/data.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  constructor(private data: DataService) {
    data.getDisplays().subscribe()

  }
}
