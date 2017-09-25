import { Component ,Directive,ViewContainerRef} from '@angular/core';
// import { RouterModule, Routes } from '@angular/router';
import { Router} from "@angular/router";

import * as $ from 'jquery';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'app';
  account = "test";
  onResize(event){
   this.resizeMainWindow();
  }
  constructor(private router:Router){

  }

  resizeMainWindow(){
    $('#mainWindow').height(window.innerHeight-56-90);
  }
  logout(){
    this.account = undefined;
    // this.router.navigate(['/login']) ;
    // window.location.replace ('login.html');

  }
}


