import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AppComponent } from './app.component';

const appRoutes: Routes = [
  { path: 'health', component: AppComponent },
  { path: 'measures', component: AppComponent },
  { path: 'hero/:id',component: AppComponent },
  { path: 'mydashboard', component: AppComponent },
  {
    path: 'jobs',component: AppComponent,
    data: { title: 'Heroes List' }
  },
  { path: '',
    redirectTo: 'health',
    pathMatch: 'full'
  },
  { path: '**', component: AppComponent }
];

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(
      appRoutes,
      { enableTracing: true } // <-- debugging purposes only
    )
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
