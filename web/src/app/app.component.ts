import { Component } from '@angular/core';
import { DataService } from '@service/data.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
    standalone: false
})
export class AppComponent {

  constructor(private data: DataService) {
    data.getDisplays().subscribe()

  }
}
