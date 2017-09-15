import { Component, OnInit } from '@angular/core';
import { HttpClient} from '@angular/common/http';
import { Ng2SmartTableModule ,LocalDataSource} from 'ng2-smart-table';
import {DataTableModule} from "angular2-datatable";

import { DatePipe } from '@angular/common';
import { Router} from "@angular/router";
import * as $ from 'jquery';

@Component({
  selector: 'app-job',
  templateUrl: './job.component.html',
  styleUrls: ['./job.component.css']
})
export class JobComponent implements OnInit {
  // results:object[];
  allInstances:any;
  results:any;
  source:LocalDataSource;
  deletedBriefRow:object;
  jobName:string;
  public visible = false;
  public visibleAnimate = false;
  oldindex:number;


  deletedRow : object;
  sourceTable :string;
  targetTable :string;
  deleteId : string;
  deleteIndex:number;
  deleteGroup :string;
  deleteJob :string;


  
  constructor(private http:HttpClient,private router:Router) { };

  public hide(): void {
    this.visibleAnimate = false;
    setTimeout(() => this.visible = false, 300);
  }

  public onContainerClicked(event: MouseEvent): void {
    if ((<HTMLElement>event.target).classList.contains('modal')) {
      this.hide();
    }
  }
  

  remove(row){
    this.visible = true;
    setTimeout(() => this.visibleAnimate = true, 100);
    this.deletedRow = row;
    this.deleteIndex = this.results.indexOf(row);
    this.deletedBriefRow = row;
    this.deleteGroup = row.groupName;
    this.deleteJob = row.jobName;
  }

  confirmDelete(){
    // let row = this.deletedBriefRow;
    let deleteUrl = 'http://localhost:8080/jobs'+ '?group=' + this.deleteGroup + '&jobName=' + this.deleteJob;
    this.http.delete(deleteUrl).subscribe(data => {
      let deleteResult:any = data;
      console.log(deleteResult.code);
      if(deleteResult.code==206){
        var self = this;
        setTimeout(function () {
          self.results.splice(self.deleteIndex,1);
          self.source.load(self.results);
          self.hide();
        },0);
      }
    },
    err =>{
        console.log('Error when deleting record');

    });
  };
  
  showInstances(row){
    let index  = this.results.indexOf(row);
    if (this.oldindex!=undefined &&this.oldindex != index){
        this.results[this.oldindex].showDetail = false;}
    let getInstanceUrl = 'http://localhost:8080/jobs/instances'+ '?group=' + 'BA' + '&jobName=' + row.jobName +'&page='+'0'+'&size='+'200';
    this.http.get(getInstanceUrl).subscribe(data =>{      
        row.showDetail = !row.showDetail;     
        this.allInstances = data;   
        // this.source = new LocalDataSource(this.allInstances);
        // this.source.load(this.allInstances);
    });
    this.oldindex = index;
    console.log(this.oldindex);
  }

  intervalFormat(second){
     if(second<60)
         return (second + 's');
     else if(second<3600)
     {
         if(second%60==0)
             return(second / 60 + 'min');
         else 
             return((second - second % 60) / 60 + 'min'+second % 60 + 's');
     }
     else 
     {
         if(second%3600==0)
             return ( second / 3600 + 'h');
         else
         {
             second = (second - second % 3600) / 3600 + 'h';
             var s = second % 3600;
             return ( second + (s-s%60)/60+'min'+s%60+'s');
         }
     }
  }
  
  
  ngOnInit():void {
    var self = this;
  	this.http.get('http://localhost:8080/jobs/').subscribe(data =>{       
        this.results = Object.keys(data).map(function(index){
          let job = data[index];
          job.showDetail = false;
          job.interval = self.intervalFormat(job.interval);
          return job;
        });     
        // this.source = new LocalDataSource(this.results);
        // this.source.load(this.results);

    });
  };
}
