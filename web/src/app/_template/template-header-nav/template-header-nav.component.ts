import { Component, OnInit } from '@angular/core';
import { WebSocketService } from '@service/webSocket.service';
import { ToastService } from '@service/toast.service';

@Component({
    selector: 'app-template-header-nav',
    templateUrl: './template-header-nav.component.html',
    styleUrls: ['./template-header-nav.component.scss'],
    standalone: false
})
export class TemplateHeaderNavComponent implements OnInit {

    constructor(
        private wsService: WebSocketService,
        private toastService: ToastService
    ) { }

    ngOnInit() {
        this.wsService.connect()
    }

    public reloadSpiegel() {
        this.toastService.info('Spiegel wird neu geladen...')
        this.wsService.sendMessage('reloadMirror')
    }

}
