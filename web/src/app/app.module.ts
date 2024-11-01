import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { MatIconModule } from '@angular/material/icon'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'

import { AppComponent } from './app.component';
import { PageConfigComponent } from './page-config/page-config.component';
import { PageSettingsComponent } from './page-settings/page-settings.component';
import { PageMirrorComponent } from './page-mirror/page-mirror.component';
import { TemplateHeaderComponent } from './_template/template-header/template-header.component';
import { TemplateHeaderNavComponent } from './_template/template-header-nav/template-header-nav.component';
import { TemplateGridComponent } from './_template/template-grid/template-grid.component';
import { TemplateGridWidgetComponent } from './_template/template-grid-widget/template-grid-widget.component';
import { ToastrModule } from 'ngx-toastr';

@NgModule({
  declarations: [
    AppComponent,
    PageConfigComponent,
    PageSettingsComponent,
    PageMirrorComponent,
    TemplateHeaderComponent,
    TemplateHeaderNavComponent,
    TemplateGridComponent,
    TemplateGridWidgetComponent
  ],
  imports: [
    BrowserModule,
    MatIconModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot(),
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
