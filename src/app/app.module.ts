import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {HttpClientModule} from '@angular/common/http';

import { Ng2SmartTableModule } from 'ng2-smart-table';
import { AppComponent } from './app.component';
import { MeasureComponent } from './measure/measure.component';
import { JobComponent } from './job/job.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { HealthComponent } from './health/health.component';
import { MydashboardComponent } from './mydashboard/mydashboard.component';

const appRoutes: Routes = [
  { 
    path: 'health',
    component: HealthComponent 
  },
  { 
    path: 'measures', 
    component: MeasureComponent 
  },
  { 
    path: 'measure/:id',
    component: MeasureComponent 
  },
  { 
    path: 'mydashboard', 
    component: AppComponent 
  },
  {
    path: 'jobs',
    component: JobComponent,
    data: { title: 'Heroes List' }
  },
  { 
    path: '',
    redirectTo: 'health',
    pathMatch: 'full'
  },
  { 
    path: '**', 
    component: AppComponent 
  }
];

@NgModule({
  declarations: [
    AppComponent,
    MeasureComponent,
    JobComponent,
    SidebarComponent,
    HealthComponent,
    MydashboardComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    Ng2SmartTableModule,
    RouterModule.forRoot(
      appRoutes,
      { enableTracing: false } // <-- debugging purposes only
    )
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
