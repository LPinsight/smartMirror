import { Component, OnInit } from '@angular/core';
import { WebSocketService } from '@service/webSocket.service';

@Component({
    selector: 'app-template-header-nav',
    templateUrl: './template-header-nav.component.html',
    styleUrls: ['./template-header-nav.component.scss'],
    standalone: false
})
export class TemplateHeaderNavComponent implements OnInit {

    constructor(private wsService: WebSocketService) { }

    ngOnInit() {
        this.wsService.connect()
    }

    public reloadSpiegel() {
        this.wsService.sendMessage('reloadMirror')
    }

}
