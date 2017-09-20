import { Component ,Directive,ViewContainerRef} from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import * as $ from 'jquery';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'app';

  onResize(event){
   this.resizeMainWindow();
  }

  resizeMainWindow(){
    $('#mainWindow').height(window.innerHeight-56-90);
  }
  logout(){
    window.location.href = 'login.html';
  }
}


