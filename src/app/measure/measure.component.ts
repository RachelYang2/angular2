import { Component, OnInit} from '@angular/core';
import { HttpClient} from '@angular/common/http';
import { Ng2SmartTableModule ,LocalDataSource} from 'ng2-smart-table';
import { Router} from "@angular/router";
import { FormControl } from '@angular/forms';
import { FormsModule } from '@angular/forms';

import { BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { ToasterModule, ToasterService} from 'angular2-toaster';
import * as $ from 'jquery';

@Component({
  selector: 'app-measure',
  templateUrl: './measure.component.html',
  styleUrls: ['./measure.component.css']
})
export class MeasureComponent implements OnInit {
  results:object[];
  source:LocalDataSource;
  public visible = false;
  public visibleAnimate = false;
  deletedRow : object;
  sourceTable :string;
  targetTable :string;
  deleteId : number;
  deleteIndex:number;

  settings = {
    columns: {
      name: {
        title: 'Measure Name',
        editable:false,
        type:'html'
      },
      type: {
        title: 'Measure Type',
        editable:false,
      },
      description: {
        title: 'Description',
        editable:false,
      },
      organization: {
        title: 'Organization',
        editable:false,
      }
    },
    actions:{
    	position:'right',
    	add:false,
    	columnTitle:'Action',
    	edit:true,
    	delete:true
    },

    hideSubHeader:true,
    edit:{
    	editButtonContent:'<i class="fa fa-eye" ></i>&nbsp;&nbsp;'
    },
    delete:{
    	deleteButtonContent:'<i class="fa fa-trash-o"></i>'
    },
    mode:'external'
  };

  public hide(): void {
    this.visibleAnimate = false;
    setTimeout(() => this.visible = false, 300);
  }

  public onContainerClicked(event: MouseEvent): void {
    if ((<HTMLElement>event.target).classList.contains('modal')) {
      this.hide();
    }
  }
 
  constructor(private http:HttpClient,private router:Router) { 
  };

  onDelete($event){
    this.visible = true;
    setTimeout(() => this.visibleAnimate = true, 100);
    this.deleteId = $event.data.id;
    this.deleteIndex = $event.index;
    this.deletedRow = $event.data;
    this.sourceTable = $event.data.source.config['table.name'];
    this.targetTable = $event.data.target.config['table.name'];
  }

  confirmDelete(){
    let deleteUrl = 'http://localhost:8080/measure/'+this.deleteId;
    this.http.delete(deleteUrl).subscribe(data => {
      let deleteResult:any = data;
      if(deleteResult.code==202){
        var self = this;
        setTimeout(function () {
          self.results.splice(self.deleteIndex,1);
          self.source.load(self.results);
          self.hide();
        },200);
      }
    });
  };

  onEdit($event){
    this.router.navigate(['/measure/'+$event.data.id]);
  };

  ngOnInit():void {
  	this.http.get('http://localhost:8080/measures').subscribe(data =>{
        for(let measure in data){
          data[measure].trueName = data[measure].name;
          // data[measure].name = '<a href="/measure/' + data[measure].id+'">'+data[measure].name;+'</a>';
        }
  		  this.results = Object.keys(data).map(function(index){
          let measure = data[index];
          return measure;
        });
        this.source = new LocalDataSource(this.results);
        this.source.load(this.results);
        $('.ng2-smart-sort-link').css('color','white');
  	});
  };
}
