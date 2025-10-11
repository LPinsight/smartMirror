import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { MatIconModule } from '@angular/material/icon'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { RouterModule, Routes } from '@angular/router';

import { AppComponent } from './app.component';
import { PageConfigComponent } from './page-config/page-config.component';
import { PageSettingsComponent } from './page-settings/page-settings.component';
import { PageMirrorComponent } from './page-mirror/page-mirror.component';
import { TemplateHeaderComponent } from './_template/template-header/template-header.component';
import { TemplateHeaderNavComponent } from './_template/template-header-nav/template-header-nav.component';
import { TemplateGridComponent } from './_template/template-grid/template-grid.component';
import { TemplateGridWidgetComponent } from './_template/template-grid-widget/template-grid-widget.component';
import { ToastrModule } from 'ngx-toastr';
import { FormsModule } from '@angular/forms';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { TemplateDisplayComponent } from './_template/template-display/template-display.component';
import { TemplateLocationComponent } from './_template/template-location/template-location.component';
import { TemplateDynamicWidgetComponent } from './_template/template-dynamic-widget/template-dynamic-widget.component';

const navigationRoutes: Routes = [
  {path: 'settings', component: PageSettingsComponent},
  {path: 'mirror', component: PageMirrorComponent},
  {path: '', component: PageConfigComponent, pathMatch: 'full'},
  // {path: '**', redirectTo: '/'},
]

@NgModule({ declarations: [
        AppComponent,
        PageConfigComponent,
        PageSettingsComponent,
        PageMirrorComponent,
        TemplateHeaderComponent,
        TemplateHeaderNavComponent,
        TemplateGridComponent,
        TemplateGridWidgetComponent,
        TemplateDisplayComponent,
        TemplateLocationComponent,
        TemplateDynamicWidgetComponent
    ],
    bootstrap: [AppComponent], imports: [BrowserModule,
        MatIconModule,
        RouterModule.forRoot(navigationRoutes),
        BrowserAnimationsModule,
        ToastrModule.forRoot(),
        FormsModule], providers: [provideHttpClient(withInterceptorsFromDi())] })
export class AppModule { }
